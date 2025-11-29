from typing import Any, Dict, List

from miraveja_log import IAsyncLogger

from ..domain import Certifier, ICertifierRepository


class ListAllCertifiersHandler:
    def __init__(self, repository: ICertifierRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self) -> Dict[str, Any]:
        await self._logger.info("Listing all certifiers")

        certifiers: List[Certifier] = self._repository.list_all()

        await self._logger.info(f"Found {len(certifiers)} certifiers")

        return {"certifiers": [certifier.model_dump() for certifier in certifiers]}
