from typing import Annotated, ClassVar, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from ...shared.models import ContactInfo, Document, Location


class Producer(BaseModel):
    """Aggregate root that represents a producer in the system.

    Attributes:
        id (UUID): Unique identifier of the producer.
        name (str): Name of the producer.
        document (Document): Document of the producer.
        address (Location): Address of the producer.
        car_code (Optional[str]): CAR code of the producer.
        contact (ContactInfo): Contact information of the producer.
        metadata (Optional[dict[str, str | float | int | bool]]): Additional metadata for the producer.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(use_enum_values=True)

    id: Annotated[UUID, Field(default=uuid4(), description="Unique identifier of the producer")] = uuid4()
    name: Annotated[str, Field(description="Name of the producer", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document of the producer")]
    address: Annotated[Location, Field(description="Address of the producer")]
    car_code: Annotated[Optional[str], Field(default=None, description="CAR code of the producer", max_length=100)] = (
        None
    )
    contact: Annotated[ContactInfo, Field(description="Contact information of the producer")]
    metadata: Annotated[
        Optional[dict[str, str | float | int | bool | List[str]]],
        Field(
            description="Additional metadata for the producer. Can only contain primitive types.", default_factory=dict
        ),
    ]

    @field_serializer("id")
    def serialize_id(self, id: UUID) -> str:
        return str(id)
