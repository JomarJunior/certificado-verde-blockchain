from typing import Any, Dict, Optional

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Certificate, IBlockchainService, ICertificateRepository


class ValidateCertificateHandler:
    def __init__(
        self,
        repository: ICertificateRepository,
        blockchain_service: IBlockchainService,
        logger: IAsyncLogger,
    ):
        self._repository = repository
        self._blockchain_service = blockchain_service
        self._logger = logger

    async def handle(self, certificate_hash: str) -> Dict[str, Any]:
        """Handles the validation of a certificate.

        Args:
            certificate_hash (str): The canonical hash of the certificate.
        Returns:
            Dict[str, Any]: A dictionary containing the result of the operation.
        """

        certificate: Optional[Certificate] = self._repository.find_by_canonical_hash(certificate_hash)
        if not certificate:
            raise DomainException("No certificate found matching the provided canonical hash.", code=404)

        return {
            "certificate": certificate.model_dump(),
            "is_valid": True,
        }
