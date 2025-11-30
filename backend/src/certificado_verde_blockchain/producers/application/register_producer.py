from typing import Annotated, Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.models import ContactInfo, Document, Location
from ..domain import IProducerRepository, Producer


class RegisterProducerCommand(BaseModel):
    name: Annotated[str, Field(description="Name of the producer", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document of the producer")]
    address: Annotated[Location, Field(description="Address of the producer")]
    car_code: Annotated[Optional[str], Field(description="CAR code of the producer", max_length=100)]
    contact: Annotated[ContactInfo, Field(description="Contact information of the producer")]
    metadata: Annotated[
        Optional[dict[str, str | float | int | bool | List[str]]],
        Field(
            description="Additional metadata for the producer. Can only contain primitive types.", default_factory=dict
        ),
    ]


class RegisterProducerHandler:
    def __init__(self, producer_repository: IProducerRepository, logger: IAsyncLogger) -> None:
        self._producer_repository = producer_repository
        self._logger = logger

    async def handle(self, command: RegisterProducerCommand) -> Dict[str, Any]:
        await self._logger.info(f"Registering new producer: {command.name}")

        producer = Producer(
            id=uuid4(),
            name=command.name,
            document=command.document,
            address=command.address,
            car_code=command.car_code,
            contact=command.contact,
            metadata=command.metadata,
        )

        self._producer_repository.save(producer)

        await self._logger.info(f"Producer registered with ID: {producer.id}")

        return {"producer": producer.model_dump()}
