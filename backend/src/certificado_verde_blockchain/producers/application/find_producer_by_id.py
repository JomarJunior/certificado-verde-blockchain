from typing import Any, Dict, Optional
from uuid import UUID

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import IProducerRepository, Producer


class FindProducerByIdHandler:
    def __init__(self, producer_repository: IProducerRepository, logger: IAsyncLogger):
        self._producer_repository = producer_repository
        self._logger = logger

    async def handle(self, producer_id: UUID) -> Dict[str, Any]:
        await self._logger.info(f"Finding producer by ID: {producer_id}")

        producer: Optional[Producer] = self._producer_repository.find_by_id(producer_id)

        if producer:
            await self._logger.info(f"Producer found: {producer_id}")
        else:
            await self._logger.warning(f"Producer not found: {producer_id}")
            raise DomainException(f"Producer with ID {producer_id} not found", 404)

        return producer.model_dump()
