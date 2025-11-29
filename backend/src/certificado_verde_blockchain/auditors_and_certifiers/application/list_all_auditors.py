from typing import Any, Dict, List

from miraveja_log import IAsyncLogger

from ..domain import Auditor, IAuditorRepository


class ListAllAuditorsHandler:
    def __init__(self, repository: IAuditorRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self) -> Dict[str, Any]:
        await self._logger.info("Listing all auditors")

        auditors: List[Auditor] = self._repository.list_all()

        await self._logger.info(f"Found {len(auditors)} auditors")

        return {"auditors": [auditor.model_dump() for auditor in auditors]}
