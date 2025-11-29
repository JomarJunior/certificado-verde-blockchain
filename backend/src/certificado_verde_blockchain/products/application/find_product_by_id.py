from typing import Any, Dict, Optional
from uuid import UUID

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import IProductRepository, Product


class FindProductByIdHandler:
    def __init__(self, repository: IProductRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, product_id: UUID) -> Dict[str, Any]:
        await self._logger.info(f"Finding product with ID: {product_id}")

        product: Optional[Product] = self._repository.find_by_id(product_id)

        if product:
            await self._logger.info(f"Product found: {product}")
        else:
            await self._logger.warning(f"Product with ID {product_id} not found")
            raise DomainException(f"Product with ID {product_id} not found", 404)

        return product.model_dump()
