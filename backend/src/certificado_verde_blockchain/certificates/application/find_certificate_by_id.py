from typing import Any, Dict, Optional
from uuid import UUID

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Certificate, IBlockchainService, ICertificateRepository


class FindCertificateByIdHandler:
    def __init__(
        self, repository: ICertificateRepository, blockchain_service: IBlockchainService, logger: IAsyncLogger
    ):
        self._repository = repository
        self._blockchain_service = blockchain_service
        self._logger = logger

    async def handle(self, certificate_id: UUID) -> Dict[str, Any]:
        await self._logger.info(f"Finding certificate with ID: {certificate_id}")

        certificate: Optional[Certificate] = self._repository.find_by_id(certificate_id)

        if certificate:
            await self._logger.info(f"Certificate found: {certificate}")
        else:
            await self._logger.warning(f"Certificate with ID {certificate_id} not found")
            raise DomainException(f"Certificate with ID {certificate_id} not found", 404)

        certificate_dict = certificate.model_dump()
        if certificate.is_pre_issued:
            await self._logger.info(f"Certificate {certificate_id} is pre-issued, computing hash.")
            certificate_hash = await self._blockchain_service.hash_data(certificate_dict)
            certificate_dict["pre_issued_hash"] = certificate_hash

        return certificate_dict
