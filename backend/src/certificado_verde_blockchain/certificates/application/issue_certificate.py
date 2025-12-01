from datetime import datetime, timezone
from typing import Any, Dict
from uuid import UUID

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...configuration import AppConfig
from ...shared.errors import DomainException
from ..domain import (
    AuthenticityProof,
    CanonicalCertificate,
    CanonicalCertificateService,
    IBlockchainService,
    ICertificateRepository,
    IFileService,
    ISerialCodeService,
    IStorageService,
)


class IssueCertificateCommand(BaseModel):
    certifier_address: str = Field(..., description="Blockchain address of the certifier issuing the certificate.")
    certifier_signature: str = Field(..., description="Digital signature of the certifier.")


class IssueCertificateHandler:
    def __init__(
        self,
        app_config: AppConfig,
        repository: ICertificateRepository,
        blockchain_service: IBlockchainService,
        serial_code_service: ISerialCodeService,
        canonical_certificate_service: CanonicalCertificateService,
        file_service: IFileService,
        storage_service: IStorageService,
        logger: IAsyncLogger,
    ):
        self._app_config = app_config
        self._repository = repository
        self._blockchain_service = blockchain_service
        self._serial_code_service = serial_code_service
        self._canonical_certificate_service = canonical_certificate_service
        self._file_service = file_service
        self._storage_service = storage_service
        self._logger = logger

    async def handle(self, certificate_id: UUID, command: IssueCertificateCommand) -> Dict[str, Any]:
        await self._logger.info(f"Issuing certificate with ID {certificate_id}.")
        # Retrieve the certificate to be issued
        certificate = self._repository.find_by_id(certificate_id)
        if not certificate:
            await self._logger.error(f"Certificate with ID {certificate_id} not found.")
            raise DomainException(f"Certificate with ID {certificate_id} not found.", 404)

        if not certificate.is_pre_issued:
            await self._logger.error(f"Certificate with ID {certificate_id} has already been issued.")
            raise DomainException(f"Certificate with ID {certificate_id} has already been issued.", 400)

        # Pre canonicalization checks
        await self._logger.info(f"Pre canonicalization sign payload:\n{certificate.model_dump()}")
        pre_canonic_hash = await self._blockchain_service.hash_data(certificate.model_dump())
        # Validate the certifier's signature
        await self._logger.info(f"Verifying certifier signature for certificate {certificate.id}.")
        await self._blockchain_service.verify_signature(
            certificate_hash=pre_canonic_hash,
            signature=command.certifier_signature,
            address=command.certifier_address,
        )
        await self._logger.info(f"Certifier signature for certificate {certificate.id} verified successfully.")

        # Build the canonical representation of the certificate
        issued_at = datetime.now(timezone.utc)
        valid_until = issued_at.replace(year=issued_at.year + 5)
        serial_code = self._serial_code_service.generate_serial_code()

        canonical_certificate: CanonicalCertificate = await self._canonical_certificate_service.build_canonical(
            certificate, issued_at.isoformat(), valid_until.isoformat(), serial_code
        )
        canonical_hash = await self._blockchain_service.hash_data(canonical_certificate)
        await self._logger.debug(f"Canonical hash for certificate {certificate.id}: {canonical_hash}")

        # Generate the QR code for the certificate and store it
        qr_code_file, content_type = self._file_service.generate_qr_code_file(
            canonical_certificate, serial_code, canonical_hash
        )
        qr_code_key = await self._storage_service.upload_qr_code(serial_code, qr_code_file, content_type)
        qr_code_url = self._app_config.get_qr_code_url_by_key(qr_code_key)
        await self._logger.info(f"QR code for certificate {certificate.id} uploaded successfully.")

        # Create the authenticity proof
        authenticity_proof = AuthenticityProof(
            serial_code=serial_code,
            qr_code_url=qr_code_url,
            certifier_signature=command.certifier_signature,
            certifier_address=command.certifier_address,
        )

        # Record the certificate on the blockchain
        blockchain_id = await self._blockchain_service.record_certificate(
            certificate_hash=canonical_hash,
            certifier_address=command.certifier_address,
        )
        await self._logger.info(f"Certificate {certificate.id} recorded on blockchain with ID {blockchain_id}.")

        # Issue the certificate
        certificate.issue(
            issued_at=issued_at,
            valid_until=valid_until,
            authenticity_proof=authenticity_proof,
            canonical_hash=canonical_hash,
            blockchain_id=blockchain_id,
        )

        self._repository.save(certificate)
        await self._logger.info(f"Successfully issued certificate {certificate.id}.")

        return {"certificate": certificate.model_dump()}
