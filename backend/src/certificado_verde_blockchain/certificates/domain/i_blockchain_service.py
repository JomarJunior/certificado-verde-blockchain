from abc import ABC, abstractmethod
from typing import Any, Mapping


class IBlockchainService(ABC):
    @abstractmethod
    async def record_certificate(self, certificate_hash: str, certifier_address: str) -> str:
        """Record the certificate data on the blockchain.

        Args:
            certificate_hash (str): The hash of the certificate to be recorded.
            certifier_address (str): The blockchain address of the certifier.

        Returns:
            str: The id of the recorded certificate.
        """

    @abstractmethod
    async def verify_signature(self, certificate_hash: str, signature: str, address: str) -> None:
        """Verify the digital signature of the certificate hash.

        Args:
            certificate_hash (str): The original certificate hash that was signed.
            signature (str): The digital signature to verify.
            address (str): The public key used for verification.

        Raises:
            DomainException: If the signature is invalid.
        """

    @abstractmethod
    async def hash_data(self, data: Mapping[str, Any]) -> str:
        """Generate a hash for the given mapping data.

        Args:
            data (Mapping[str, Any]): The data to be hashed.
        Returns:
            str: The generated hash of the data.
        """
