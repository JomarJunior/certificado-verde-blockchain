from typing import Dict, List, Optional, Union
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from ....shared.enums import DocumentType
from ....shared.models import ContactInfo, Coordinates, Document, Location
from ....shared.sql import Base
from ...domain import Producer


class ProducerEntity(Base):
    """SQLAlchemy entity that maps to the producers table in the database.
    It provides methods to convert between the domain Producer model and the database representation.

    Attributes:
        id (str): Unique identifier for the producer.
        name (str): Name of the producer.
        document_type (str): Type of document of the producer.
        document_number (str): Document number of the producer.
        address_country (str): Country of the producer's address.
        address_state (Optional[str]): State of the producer's address.
        address_city (Optional[str]): City of the producer's address.
        address_latitude (Optional[float]): Latitude of the producer's address.
        address_longitude (Optional[float]): Longitude of the producer's address.
        car_code (Optional[str]): CAR code of the producer.
        contact_phone (str): Contact phone number of the producer.
        contact_email (str): Contact email of the producer.
        contact_website (Optional[str]): Contact website of the producer.
        _metadata (Optional[Dict[str, Union[str, float, int, bool]]]): Additional metadata for the producer.
    """

    __tablename__ = "producers"

    id: Mapped[str] = mapped_column(PG_UUID(as_uuid=False), primary_key=True, default=sa.text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(sa.Enum(DocumentType), nullable=False)
    document_number: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    address_country: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    address_state: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    address_city: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    address_latitude: Mapped[float] = mapped_column(sa.Float, nullable=False)
    address_longitude: Mapped[float] = mapped_column(sa.Float, nullable=False)
    car_code: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(sa.String(20), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(sa.String(255), nullable=True)
    contact_website: Mapped[Optional[str]] = mapped_column(sa.String(255), nullable=True)
    _metadata: Mapped[Optional[Dict[str, Union[str, float, int, bool, List[str]]]]] = mapped_column(
        JSONB, nullable=True, name="metadata"
    )

    @classmethod
    def from_domain(cls, producer: Producer) -> "ProducerEntity":
        """Creates a ProducerEntity from a domain Producer model.

        Args:
            producer (Producer): The domain Producer model.

        Returns:
            ProducerEntity: The corresponding ProducerEntity.
        """
        return cls(
            id=str(producer.id),
            name=producer.name,
            document_type=producer.document.document_type,
            document_number=producer.document.number,
            address_country=producer.address.country,
            address_state=producer.address.state,
            address_city=producer.address.city,
            address_latitude=producer.address.coordinates.latitude,
            address_longitude=producer.address.coordinates.longitude,
            car_code=producer.car_code,
            contact_phone=producer.contact.phone,
            contact_email=producer.contact.email,
            contact_website=producer.contact.website,
            _metadata=producer.metadata,
        )

    def to_domain(self) -> Producer:
        """Converts the ProducerEntity to a domain Producer model.

        Returns:
            Producer: The corresponding domain Producer model.
        """

        document = Document(document_type=self.document_type, number=self.document_number)
        coordinates = Coordinates(latitude=self.address_latitude, longitude=self.address_longitude)
        address = Location(
            country=self.address_country,
            state=self.address_state,
            city=self.address_city,
            coordinates=coordinates,
        )
        contact = ContactInfo(
            phone=self.contact_phone,
            email=self.contact_email,
            website=self.contact_website,
        )

        return Producer(
            id=UUID(self.id),
            name=self.name,
            document=document,
            address=address,
            car_code=self.car_code,
            contact=contact,
            metadata=self._metadata,
        )
