from typing import Any, Dict, Optional
from uuid import UUID

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Auditor, IAuditorRepository


class FindAuditorByIdHandler:
    def __init__(self, repository: IAuditorRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, auditor_id: UUID) -> Dict[str, Any]:
        await self._logger.info(f"Finding auditor with ID: {auditor_id}")

        auditor: Optional[Auditor] = self._repository.find_by_id(auditor_id)

        if auditor:
            await self._logger.info(f"Auditor found: {auditor}")
        else:
            await self._logger.warning(f"Auditor with ID {auditor_id} not found")
            raise DomainException(f"Auditor with ID {auditor_id} not found", 404)

        return auditor.model_dump()
