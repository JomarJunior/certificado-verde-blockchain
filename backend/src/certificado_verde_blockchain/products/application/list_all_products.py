from typing import Any, Dict, List

from miraveja_log import IAsyncLogger

from ..domain import IProductRepository, Product


class ListAllProductsHandler:
    def __init__(self, repository: IProductRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self) -> Dict[str, Any]:
        await self._logger.info("Listing all products")

        products: List[Product] = self._repository.list_all()

        await self._logger.info(f"Found {len(products)} products")

        return {"products": [product.model_dump() for product in products]}
