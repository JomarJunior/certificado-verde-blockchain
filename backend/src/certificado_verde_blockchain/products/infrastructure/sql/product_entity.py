from typing import Dict, List, Optional, Union
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from ....shared.models.location import Coordinates, Location
from ....shared.sql import Base
from ...domain import MeasurementUnit, Product, ProductCategory, Quantity


class ProductEntity(Base):
    """SQLAlchemy entity that maps to the products table in the database.
    It provides methods to convert between the domain Product model and the database representation.

    Attributes:
        id (str): Unique identifier for the product.
        name (str): Name of the product.
        description (Optional[str]): Detailed description of the product.
        category (ProductCategory): Category of the product.
        quantity_value (float): Quantity value of the product.
        quantity_unit (MeasurementUnit): Measurement unit of the product.
        origin_country (str): Country of origin of the product.
        origin_state (Optional[str]): State of origin of the product.
        origin_city (Optional[str]): City of origin of the product.
        origin_latitude (float): Latitude of the product's origin.
        origin_longitude (float): Longitude of the product's origin.
        lot_number (Optional[str]): Lot number of the product.
        carbon_emission (Optional[float]): Carbon emission associated with the product.
        _metadata (Optional[Dict[str, Union[str, float, int, bool]]]): Additional metadata for the product.
        tags (Optional[List[str]]): Tags associated with the product.

    Methods:
        from_domain(product: Product) -> "ProductEntity":
            Creates a ProductEntity from a domain Product model.
        to_domain() -> Product:
            Converts the ProductEntity to a domain Product model.
    """

    __tablename__ = "products"

    id: Mapped[str] = mapped_column(PG_UUID(as_uuid=False), primary_key=True, default=sa.text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(sa.Text, nullable=True)
    category: Mapped[ProductCategory] = mapped_column(sa.Enum(ProductCategory), nullable=False)
    quantity_value: Mapped[float] = mapped_column(sa.Float, nullable=False)
    quantity_unit: Mapped[MeasurementUnit] = mapped_column(sa.Enum(MeasurementUnit), nullable=False)
    origin_country: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    origin_state: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    origin_city: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    origin_latitude: Mapped[float] = mapped_column(sa.Float, nullable=False)
    origin_longitude: Mapped[float] = mapped_column(sa.Float, nullable=False)
    lot_number: Mapped[Optional[str]] = mapped_column(sa.String(100), nullable=True)
    carbon_emission: Mapped[Optional[float]] = mapped_column(sa.Float, nullable=True)
    _metadata: Mapped[Optional[Dict[str, Union[str, float, int, bool]]]] = mapped_column(
        JSONB, nullable=True, name="metadata"
    )
    tags: Mapped[Optional[List[str]]] = mapped_column(sa.ARRAY(sa.String), nullable=True)

    @classmethod
    def from_domain(cls, product: Product) -> "ProductEntity":
        """Creates a ProductEntity from a domain Product model.

        Args:
            product (Product): The domain Product model to convert.

        Returns:
            ProductEntity: The corresponding ProductEntity instance.
        """
        return cls(
            id=str(product.id),
            name=product.name,
            description=product.description,
            category=product.category,
            quantity_value=product.quantity.value,
            quantity_unit=product.quantity.unit,
            origin_country=product.origin.country,
            origin_state=product.origin.state,
            origin_city=product.origin.city,
            origin_latitude=product.origin.coordinates.latitude,
            origin_longitude=product.origin.coordinates.longitude,
            lot_number=product.lot_number,
            carbon_emission=product.carbon_emission,
            _metadata=product.metadata,
            tags=product.tags,
        )

    def to_domain(self) -> Product:
        """Converts the ProductEntity to a domain Product model.

        Returns:
            Product: The corresponding domain Product model.
        """
        origin = Location(
            country=self.origin_country,
            state=self.origin_state,
            city=self.origin_city,
            coordinates=Coordinates(
                latitude=self.origin_latitude,
                longitude=self.origin_longitude,
            ),
        )

        quantity = Quantity(
            value=self.quantity_value,
            unit=self.quantity_unit,
        )

        return Product(
            id=UUID(self.id),
            name=self.name,
            description=self.description,
            category=self.category,
            quantity=quantity,
            origin=origin,
            lot_number=self.lot_number,
            carbon_emission=self.carbon_emission,
            metadata=self._metadata,
            tags=self.tags,
        )
