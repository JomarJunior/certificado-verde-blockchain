from typing import Any, Dict, List

from miraveja_log import IAsyncLogger

from ..domain import IProducerRepository, Producer


class ListAllProducersHandler:
    def __init__(self, producer_repository: IProducerRepository, logger: IAsyncLogger):
        self._producer_repository = producer_repository
        self._logger = logger

    async def handle(self) -> Dict[str, Any]:

        await self._logger.info("Listing all producers")

        producers: List[Producer] = self._producer_repository.list_all()

        await self._logger.info(f"Found {len(producers)} producers")

        return {"producers": [producer.model_dump() for producer in producers]}
