from fastapi import APIRouter
from miraveja_di import DIContainer

from ...application import (
    IssueCertificateCommand,
    RegisterPDFHashCommand,
    RegisterPreCertificateCommand,
    ValidatePDFFileCommand,
)
from .certificates_controller import CertificatesController


class CertificatesRoutes:
    @staticmethod
    def register_routes(router: APIRouter, container: DIContainer) -> None:
        """Register certificate-related routes in the FastAPI router.

        Args:
            router (APIRouter): The FastAPI router to register routes on.
            container (DIContainer): The dependency injection container.
        """
        certificates_controller = container.resolve(CertificatesController)

        @router.get("/certificates/pre/")
        async def list_pre_certificates():
            return await certificates_controller.list_pre_certificates()

        @router.get("/certificates/{certificate_id}")
        async def find_certificate_by_id(certificate_id: str):
            return await certificates_controller.find_certificate_by_id(certificate_id)

        @router.post("/certificates/pre/", status_code=201)
        async def register_pre_certificate(command: RegisterPreCertificateCommand):
            return await certificates_controller.register_pre_certificate(command)

        @router.post("/certificates/{certificate_id}", status_code=201)
        async def issue_certificate(certificate_id: str, command: IssueCertificateCommand):
            return await certificates_controller.issue_certificate(certificate_id, command)

        @router.get("/certificates/qr_codes/{qr_code_key}")
        async def find_qr_code_by_key(qr_code_key: str):
            return await certificates_controller.find_qr_code_by_key(qr_code_key)

        @router.post("/certificates/{certificate_id}/pdf_hash", status_code=201)
        async def register_pdf_hash(certificate_id: str, command: RegisterPDFHashCommand):
            return await certificates_controller.register_pdf_hash(certificate_id, command)

        @router.get("/certificates/validate/{certificate_hash}")
        async def validate_certificate(certificate_hash: str):
            return await certificates_controller.validate_certificate(certificate_hash)

        @router.post("/certificates/validate/pdf")
        async def validate_pdf_file(command: ValidatePDFFileCommand):
            return await certificates_controller.validate_pdf_file(command)
