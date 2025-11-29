from typing import Any, Dict, Optional
from uuid import UUID

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Certifier, ICertifierRepository


class FindCertifierByIdHandler:
    def __init__(self, repository: ICertifierRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, certifier_id: UUID) -> Dict[str, Any]:
        await self._logger.info(f"Finding certifier with ID: {certifier_id}")

        certifier: Optional[Certifier] = self._repository.find_by_id(certifier_id)

        if certifier:
            await self._logger.info(f"Certifier found: {certifier}")
        else:
            await self._logger.warning(f"Certifier with ID {certifier_id} not found")
            raise DomainException(f"Certifier with ID {certifier_id} not found", 404)

        return certifier.model_dump()
