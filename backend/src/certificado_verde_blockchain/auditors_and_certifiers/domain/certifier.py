from typing import Annotated, Any, ClassVar, List
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from ...shared.models import Document
from .auditor import Auditor


class Certifier(BaseModel):
    """Aggregate root that represents a certifier in the system.

    Attributes:
        id (UUID): Unique identifier for the certifier.
        name (str): Name of the certifier.
        document (Document): Document information of the certifier.
        auditors (List[Auditor]): List of auditors associated with the certifier.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict()

    id: Annotated[
        UUID,
        Field(
            default_factory=uuid4,
            description="Unique identifier for the certifier.",
        ),
    ]
    name: Annotated[str, Field(description="Name of the certifier.", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document information of the certifier.")]
    auditors: Annotated[List[Auditor], Field(description="List of auditors associated with the certifier.")] = []

    @field_serializer("id")
    def serialize_id(self, id: UUID) -> str:
        return str(id)

    def is_auditor_associated(self, auditor_id: UUID) -> bool:
        """Check if an auditor is associated with the certifier.

        Args:
            auditor_id (UUID): The unique identifier of the auditor to check.
        Returns:
            bool: True if the auditor is associated, False otherwise.
        """
        return any(auditor.id == auditor_id for auditor in self.auditors)

    def add_auditor(self, auditor: Auditor) -> None:
        """Associate an auditor with the certifier.

        Args:
            auditor (Auditor): The auditor to associate.
        """
        if not self.is_auditor_associated(auditor.id):
            self.auditors.append(auditor)

    def remove_auditor(self, auditor_id: UUID) -> None:
        """Dissociate an auditor from the certifier.

        Args:
            auditor_id (UUID): The unique identifier of the auditor to dissociate.
        """
        self.auditors = [auditor for auditor in self.auditors if auditor.id != auditor_id]

    def __getitem__(self, auditor_id: UUID) -> Any:
        """Get an auditor associated with the certifier by its ID.

        Args:
            auditor_id (UUID): The unique identifier of the auditor to retrieve.
        Returns:
            Auditor: The auditor with the specified ID.
        Raises:
            KeyError: If the auditor is not associated with the certifier.
        """
        for auditor in self.auditors:
            if auditor.id == auditor_id:
                return auditor
        raise KeyError(f"Auditor with ID {auditor_id} not found.")
