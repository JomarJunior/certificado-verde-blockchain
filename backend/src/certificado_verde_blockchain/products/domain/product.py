from typing import Annotated, ClassVar, Dict, List, Optional, Union
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from ...shared.models.location import Location
from .product_category import ProductCategory
from .quantity import Quantity


class Product(BaseModel):
    """Aggregate root that represents a product in the system.

    Attributes:
        id (UUID): Unique identifier for the product.
        name (str): Name of the product.
        description (Optional[str]): Detailed description of the product.
        category (ProductCategory): Category of the product.
        quantity (Quantity): Quantity of the product with its measurement unit.
        origin (Location): Geographical origin of the product.
        lot_number (Optional[str]): Lot number of the product.
        carbon_emission (Optional[float]): Carbon emission associated with the product.
        metadata (Optional[Dict[str, Union[str, float, int, bool]]]): Additional metadata for the product.
        tags (Optional[List[str]]): Tags associated with the product.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(use_enum_values=True)

    id: Annotated[
        UUID,
        Field(
            default=uuid4(),
            description="Unique identifier for the product.",
        ),
    ] = uuid4()
    name: Annotated[str, Field(description="Name of the product.", min_length=1, max_length=255)]
    description: Annotated[Optional[str], Field(description="Detailed description of the product.", max_length=1000)]
    category: Annotated[ProductCategory, Field(description="Category of the product.")]
    quantity: Annotated[Quantity, Field(description="Quantity of the product with its measurement unit.")]
    origin: Annotated[Location, Field(description="Geographical origin of the product.")]
    lot_number: Annotated[Optional[str], Field(description="Lot number of the product.", max_length=100)]
    carbon_emission: Annotated[Optional[float], Field(description="Carbon emission associated with the product.", ge=0)]
    metadata: Annotated[
        Optional[Dict[str, Union[str, float, int, bool]]],
        Field(
            description="Additional metadata for the product. Can only contain primitive types.", default_factory=dict
        ),
    ]
    tags: Annotated[Optional[List[str]], Field(description="Tags associated with the product.", default_factory=list)]

    @field_serializer("id")
    def serialize_id(self, id: UUID) -> str:
        return str(id)
