from fastapi import APIRouter
from miraveja_di import DIContainer

from ...application import RegisterProductCommand
from .product_controller import ProductController


class ProductRoutes:
    @staticmethod
    def register_routes(router: APIRouter, container: DIContainer) -> None:
        """Register product-related routes in the FastAPI router.

        Args:
            router (APIRouter): The FastAPI router to register routes on.
            container (DIContainer): The dependency injection container.
        """
        product_controller = container.resolve(ProductController)

        @router.get("/products/")
        async def list_all_products():
            return await product_controller.list_all_products()

        @router.get("/products/{product_id}")
        async def find_product_by_id(product_id: str):
            return await product_controller.find_product_by_id(product_id)

        @router.post("/products/", status_code=201)
        async def register_product(command: RegisterProductCommand):
            return await product_controller.register_product(command)
