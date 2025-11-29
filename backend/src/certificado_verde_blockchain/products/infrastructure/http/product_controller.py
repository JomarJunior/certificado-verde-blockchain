import json
from uuid import UUID

from fastapi import Response, status

from ...application import (
    FindProductByIdHandler,
    ListAllProductsHandler,
    RegisterProductCommand,
    RegisterProductHandler,
)


class ProductController:
    def __init__(
        self,
        list_all_products_handler: ListAllProductsHandler,
        find_product_by_id_handler: FindProductByIdHandler,
        register_product_handler: RegisterProductHandler,
    ) -> None:
        self._list_all_products_handler = list_all_products_handler
        self._find_product_by_id_handler = find_product_by_id_handler
        self._register_product_handler = register_product_handler

    async def list_all_products(self) -> Response:
        products = await self._list_all_products_handler.handle()
        return Response(content=json.dumps(products), media_type="application/json")

    async def find_product_by_id(self, product_id: str) -> Response:
        product = await self._find_product_by_id_handler.handle(UUID(product_id))
        return Response(content=json.dumps(product), media_type="application/json")

    async def register_product(self, command: RegisterProductCommand) -> Response:
        product = await self._register_product_handler.handle(command)
        return Response(content=json.dumps(product), media_type="application/json", status_code=status.HTTP_201_CREATED)
