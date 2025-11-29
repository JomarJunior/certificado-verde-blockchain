import json
from uuid import UUID

from fastapi import Response, status

from ...application import (
    FindProducerByIdHandler,
    ListAllProducersHandler,
    RegisterProducerCommand,
    RegisterProducerHandler,
)


class ProducerController:
    def __init__(
        self,
        list_all_producers_handler: ListAllProducersHandler,
        find_producer_by_id_handler: FindProducerByIdHandler,
        register_producer_handler: RegisterProducerHandler,
    ) -> None:
        self._list_all_producers_handler = list_all_producers_handler
        self._find_producer_by_id_handler = find_producer_by_id_handler
        self._register_producer_handler = register_producer_handler

    async def list_all_producers(self) -> Response:
        producers = await self._list_all_producers_handler.handle()
        return Response(content=json.dumps(producers), media_type="application/json")

    async def find_producer_by_id(self, producer_id: str) -> Response:
        producer = await self._find_producer_by_id_handler.handle(UUID(producer_id))
        return Response(content=json.dumps(producer), media_type="application/json")

    async def register_producer(self, command: RegisterProducerCommand) -> Response:
        producer = await self._register_producer_handler.handle(command)
        return Response(
            content=json.dumps(producer), media_type="application/json", status_code=status.HTTP_201_CREATED
        )
