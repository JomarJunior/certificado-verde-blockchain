from typing import Annotated, Any, Dict, List, Optional, Union
from uuid import uuid4

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.models import Location
from ..domain import IProductRepository, Product, ProductCategory, Quantity


class RegisterProductCommand(BaseModel):
    name: Annotated[str, Field(description="Name of the product.", min_length=1, max_length=255)]
    description: Annotated[Optional[str], Field(description="Detailed description of the product.", max_length=1000)]
    category: Annotated[ProductCategory, Field(description="Category of the product.")]
    quantity: Annotated[Quantity, Field(description="Quantity of the product with its measurement unit.")]
    origin: Annotated[Location, Field(description="Geographical origin of the product.")]
    lot_number: Annotated[Optional[str], Field(description="Lot number of the product.", max_length=100)]
    carbon_emission: Annotated[Optional[float], Field(description="Carbon emission associated with the product.", ge=0)]
    metadata: Annotated[
        Optional[Dict[str, Union[str, float, int, bool]]], Field(description="Additional metadata for the product.")
    ]
    tags: Annotated[Optional[List[str]], Field(description="Tags associated with the product.")]


class RegisterProductHandler:
    def __init__(self, repository: IProductRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, command: RegisterProductCommand) -> Dict[str, Any]:
        await self._logger.info(f"Registering new product: {command.name}")

        product = Product(
            id=uuid4(),
            name=command.name,
            description=command.description,
            category=command.category,
            quantity=command.quantity,
            origin=command.origin,
            lot_number=command.lot_number,
            carbon_emission=command.carbon_emission,
            metadata=command.metadata,
            tags=command.tags,
        )

        self._repository.save(product)

        await self._logger.info(f"Product registered with ID: {product.id}")

        return {"product": product.model_dump()}
