from typing import Any, Dict, List

from miraveja_log import IAsyncLogger

from ..domain import Certificate, ICertificateRepository


class ListPreCertificatesHandler:
    def __init__(
        self,
        repository: ICertificateRepository,
        logger: IAsyncLogger,
    ):
        self._repository = repository
        self._logger = logger

    async def handle(self) -> List[Dict[str, Any]]:
        """Handles the listing of all pre-certificates.

        Returns:
            List[Dict[str, Any]]: A list of all pre-certificates.
        """
        await self._logger.info("Listing all pre-certificates.")
        all_certificates: List[Certificate] = self._repository.list_all()
        pre_certificates = [cert for cert in all_certificates if cert.is_pre_issued]
        await self._logger.info(f"Found {len(pre_certificates)} pre-certificates.")
        return [cert.model_dump() for cert in pre_certificates]
