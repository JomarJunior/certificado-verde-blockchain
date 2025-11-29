from fastapi import APIRouter
from miraveja_di import DIContainer

from ...application import RegisterProducerCommand
from .producer_controller import ProducerController


class ProducerRoutes:
    @staticmethod
    def register_routes(router: APIRouter, container: DIContainer) -> None:
        """Register producer-related routes in the FastAPI router.

        Args:
            router (APIRouter): The FastAPI router to register routes on.
            container (DIContainer): The dependency injection container.
        """
        producer_controller = container.resolve(ProducerController)

        @router.get("/producers/")
        async def list_all_producers():
            return await producer_controller.list_all_producers()

        @router.get("/producers/{producer_id}")
        async def find_producer_by_id(producer_id: str):
            return await producer_controller.find_producer_by_id(producer_id)

        @router.post("/producers/", status_code=201)
        async def register_producer(command: RegisterProducerCommand):
            return await producer_controller.register_producer(command)
