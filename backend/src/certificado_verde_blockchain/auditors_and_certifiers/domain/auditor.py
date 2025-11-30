from typing import Annotated, ClassVar
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from ...shared.models import Document


class Auditor(BaseModel):
    """Aggregate root that represents an auditor in the system.

    Attributes:
        id (UUID): Unique identifier for the auditor.
        name (str): Name of the auditor.
        document (Document): Document information of the auditor.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict()

    id: Annotated[
        UUID,
        Field(
            default_factory=uuid4,
            description="Unique identifier for the auditor.",
        ),
    ]
    name: Annotated[str, Field(description="Name of the auditor.", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document information of the auditor.")]

    @field_serializer("id")
    def serialize_id(self, id: UUID) -> str:
        return str(id)
