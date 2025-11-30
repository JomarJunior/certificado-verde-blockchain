import asyncio
import json
from typing import Any, Mapping, Optional

from eth_account.datastructures import SignedTransaction
from eth_account.messages import encode_defunct
from web3 import Web3
from web3.contract import Contract

from ...configuration import BlockchainConfig
from ...shared.errors import DomainException
from ..domain import IBlockchainService


class Web3BlockchainService(IBlockchainService):
    def __init__(self, config: BlockchainConfig, web3_client: Web3):
        self.config = config
        self.web3_client = web3_client
        self.contract: Optional[Contract] = None
        self._initialize()

    def _initialize(self):
        if self.contract is not None:
            return

        with open(self.config.abi_path, "r", encoding="utf-8") as abi_file:
            contract_abi = abi_file.read()
            abi_file_json = json.loads(contract_abi)
            abi = abi_file_json.get("abi")
            if abi is None:
                raise DomainException("Invalid ABI file format: 'abi' key not found.")

        contract_address = Web3.to_checksum_address(self.config.contract)
        self.contract = self.web3_client.eth.contract(
            address=contract_address,
            abi=json.dumps(abi),
        )

    async def record_certificate(self, certificate_hash: str, certifier_address: str) -> str:
        if self.contract is None:
            raise DomainException("Blockchain contract is not initialized.")

        try:
            checksum_certifier_address = Web3.to_checksum_address(certifier_address)
            nonce = self.web3_client.eth.get_transaction_count(checksum_certifier_address)
            txn = self.contract.functions.issueCertificate(
                checksum_certifier_address,
                certificate_hash,
            ).build_transaction(
                {
                    "from": self.config.admin_address,
                    "nonce": nonce,
                    "gas": 2000000,
                    "gasPrice": self.web3_client.to_wei("50", "gwei"),
                }
            )

            signed_txn: SignedTransaction = self.web3_client.eth.account.sign_transaction(
                txn, private_key=self.config.private_key
            )
            tx_hash = self.web3_client.eth.send_raw_transaction(signed_txn.raw_transaction)

            # Wait for transaction receipt
            loop = asyncio.get_event_loop()
            receipt = await loop.run_in_executor(
                None,
                lambda: self.web3_client.eth.wait_for_transaction_receipt(tx_hash),
            )

            if receipt["status"] != 1:
                raise DomainException("Transaction failed on the blockchain.")

            # Extract the CertificateIssued event from the receipt
            events = self.contract.events.CertificateIssued().process_receipt(receipt)

            if not events:
                raise DomainException(
                    f"No CertificateIssued event found in the transaction receipt.\nLogs: {receipt['logs']}"
                )

            event_args = events[0]["args"]

            certificate_id = event_args.get("id")

            if certificate_id is None:
                raise DomainException("Certificate ID not found in the event arguments.")

            return certificate_id
        except DomainException:
            raise
        except Exception as e:
            raise DomainException(f"Failed to record certificate: {str(e)}") from e

    async def hash_data(self, data: Mapping[str, Any]) -> str:
        """Generate the keccak256 hash for the given mapping data.

        Args:
            data (Mapping[str, Any]): The data to be hashed.
        Returns:
            str: The generated hash of the data.
        """
        try:
            # Convert the mapping data to a JSON string and then to bytes
            data_json = json.dumps(data, sort_keys=True).replace(" ", "")
            # Compute the keccak256 hash
            data_hash = self.web3_client.keccak(text=data_json)
            # Return the hex representation of the hash
            return data_hash.hex()
        except Exception as e:
            raise DomainException(f"Failed to hash data: {str(e)}") from e

    async def verify_signature(self, certificate_hash: str, signature: str, address: str) -> None:
        """Verify the digital signature of the certificate hash.

        Args:
            certificate_hash (str): The original certificate hash that was signed (keccak256 hash).
            signature (str): The digital signature to verify (in hex format).
            address (str): The public key used for verification (string address).
        """
        try:
            checksum_address = Web3.to_checksum_address(address)
            signable_certificate = encode_defunct(hexstr=certificate_hash)

            signature_bytes = bytes.fromhex(signature[2:] if signature.startswith("0x") else signature)

            recovered_address = self.web3_client.eth.account.recover_message(
                signable_certificate, signature=signature_bytes
            )
            if recovered_address != checksum_address:
                raise DomainException("Invalid signature: recovered address does not match the provided address.")
        except DomainException:
            raise
        except Exception as e:
            raise DomainException(f"Failed to verify signature: {str(e)}") from e
