from fastapi import APIRouter
from miraveja_di import DIContainer

from ...application import RegisterAuditorCommand, RegisterCertifierCommand
from .auditors_and_certifiers_controller import AuditorsAndCertifiersController


class AuditorsAndCertifiersRoutes:
    @staticmethod
    def register_routes(router: APIRouter, container: DIContainer) -> None:
        """Register auditors and certifiers related routes in the FastAPI router.

        Args:
            router (APIRouter): The FastAPI router to register routes on.
            container (DIContainer): The dependency injection container.
        """
        controller = container.resolve(AuditorsAndCertifiersController)

        @router.get("/auditors/")
        async def list_all_auditors():
            return await controller.list_all_auditors()

        @router.get("/auditors/{auditor_id}")
        async def find_auditor_by_id(auditor_id: str):
            return await controller.find_auditor_by_id(auditor_id)

        @router.post("/auditors/", status_code=201)
        async def register_auditor(command: RegisterAuditorCommand):
            return await controller.register_auditor(command)

        @router.get("/certifiers/")
        async def list_all_certifiers():
            return await controller.list_all_certifiers()

        @router.get("/certifiers/{certifier_id}")
        async def find_certifier_by_id(certifier_id: str):
            return await controller.find_certifier_by_id(certifier_id)

        @router.post("/certifiers/", status_code=201)
        async def register_certifier(command: RegisterCertifierCommand):
            return await controller.register_certifier(command)
