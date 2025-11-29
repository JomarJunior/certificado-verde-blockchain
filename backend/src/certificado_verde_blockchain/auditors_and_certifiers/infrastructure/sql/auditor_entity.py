from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from ....shared.enums import DocumentType
from ....shared.models import Document
from ....shared.sql import Base
from ...domain import Auditor


class AuditorEntity(Base):
    """SQLAlchemy entity that maps to the auditors table in the database.
    It provides methods to convert between the domain Auditor model and the database representation.

    Attributes:
        id (str): Unique identifier for the auditor.
        name (str): Name of the auditor.
        document_type (DocumentType): Type of the document.
        document_number (str): Number of the document.

    Methods:
        from_domain(auditor: Auditor) -> "AuditorEntity":
            Creates an AuditorEntity from a domain Auditor model.
        to_domain() -> Auditor:
            Converts the AuditorEntity to a domain Auditor model.
    """

    __tablename__ = "auditors"

    id: Mapped[str] = mapped_column(PG_UUID(as_uuid=False), primary_key=True, default=sa.text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(sa.Enum(DocumentType), nullable=False)
    document_number: Mapped[str] = mapped_column(sa.String(100), nullable=False, unique=True)

    @staticmethod
    def from_domain(auditor: Auditor) -> "AuditorEntity":
        """Creates an AuditorEntity from a domain Auditor model.

        Args:
            auditor (Auditor): The domain Auditor model.
        Returns:
            AuditorEntity: The corresponding AuditorEntity.
        """
        return AuditorEntity(
            id=str(auditor.id),
            name=auditor.name,
            document_type=auditor.document.document_type,
            document_number=auditor.document.number,
        )

    def to_domain(self) -> Auditor:
        """Converts the AuditorEntity to a domain Auditor model.

        Returns:
            Auditor: The corresponding domain Auditor model.
        """
        document = Document(document_type=self.document_type, number=self.document_number)
        return Auditor(id=UUID(self.id), name=self.name, document=document)
