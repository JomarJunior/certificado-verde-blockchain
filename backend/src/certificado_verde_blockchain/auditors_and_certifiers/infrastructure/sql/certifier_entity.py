from typing import List
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ....shared.enums import DocumentType
from ....shared.models import Document
from ....shared.sql import Base
from ...domain import Certifier
from .auditor_entity import AuditorEntity

certifier_auditors = sa.Table(
    "certifier_auditors",
    Base.metadata,
    sa.Column("certifier_id", PG_UUID(as_uuid=True), sa.ForeignKey("certifiers.id"), primary_key=True),
    sa.Column("auditor_id", PG_UUID(as_uuid=True), sa.ForeignKey("auditors.id"), primary_key=True),
)


class CertifierEntity(Base):
    """SQLAlchemy entity that maps to the certifiers table in the database.
    It provides methods to convert between the domain Certifier model and the database representation.

    Attributes:
        id (str): Unique identifier for the certifier.
        name (str): Name of the certifier.
        document_type (DocumentType): Type of the document.
        document_number (str): Number of the document.
        auditors (List[AuditorEntity]): List of associated auditors.

    Methods:
        from_domain(certifier: Certifier) -> "CertifierEntity":
            Creates a CertifierEntity from a domain Certifier model.
        to_domain() -> Certifier:
            Converts the CertifierEntity to a domain Certifier model.
    """

    __tablename__ = "certifiers"

    id: Mapped[str] = mapped_column(PG_UUID(as_uuid=False), primary_key=True, default=sa.text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(sa.Enum(DocumentType), nullable=False)
    document_number: Mapped[str] = mapped_column(sa.String(100), nullable=False, unique=True)
    auditors: Mapped[List[AuditorEntity]] = relationship(
        AuditorEntity,
        secondary=certifier_auditors,
        lazy="selectin",
        viewonly=False,
        backref=None,
    )

    @staticmethod
    def from_domain(certifier: Certifier) -> "CertifierEntity":
        """Creates a CertifierEntity from a domain Certifier model.

        Args:
            certifier (Certifier): The domain Certifier model.
        Returns:
            CertifierEntity: The corresponding CertifierEntity.
        """
        auditor_entities = [AuditorEntity.from_domain(auditor) for auditor in certifier.auditors]
        entity = CertifierEntity(
            id=str(certifier.id),
            name=certifier.name,
            document_type=certifier.document.document_type,
            document_number=certifier.document.number,
            auditors=auditor_entities,
        )
        return entity

    def to_domain(self) -> Certifier:
        """Converts the CertifierEntity to a domain Certifier model.

        Returns:
            Certifier: The corresponding domain Certifier model.
        """
        auditor_models = [auditor_entity.to_domain() for auditor_entity in self.auditors]
        document = Document(
            document_type=self.document_type,
            number=self.document_number,
        )
        certifier = Certifier(
            id=UUID(self.id),
            name=self.name,
            document=document,
            auditors=auditor_models,
        )
        return certifier
