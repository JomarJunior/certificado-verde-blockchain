import json
from uuid import UUID

from fastapi import Response, status

from ...application import (
    FindCertificateByIdHandler,
    FindQrCodeByKeyHandler,
    IssueCertificateCommand,
    IssueCertificateHandler,
    ListPreCertificatesHandler,
    RegisterPDFHashCommand,
    RegisterPDFHashHandler,
    RegisterPreCertificateCommand,
    RegisterPreCertificateHandler,
    ValidateCertificateHandler,
    ValidatePDFFileCommand,
    ValidatePDFFileHandler,
)


class CertificatesController:
    def __init__(
        self,
        list_pre_certificates_handler: ListPreCertificatesHandler,
        find_certificate_by_id_handler: FindCertificateByIdHandler,
        register_pre_certificate_handler: RegisterPreCertificateHandler,
        issue_certificate_handler: IssueCertificateHandler,
        find_qr_code_by_key_handler: FindQrCodeByKeyHandler,
        register_pdf_hash_handler: RegisterPDFHashHandler,
        validate_certificate_handler: ValidateCertificateHandler,
        validate_pdf_file_handler: ValidatePDFFileHandler,
    ) -> None:
        self._list_pre_certificates_handler = list_pre_certificates_handler
        self._find_certificate_by_id_handler = find_certificate_by_id_handler
        self._register_pre_certificate_handler = register_pre_certificate_handler
        self._issue_certificate_handler = issue_certificate_handler
        self._find_qr_code_by_key_handler = find_qr_code_by_key_handler
        self._register_pdf_hash_handler = register_pdf_hash_handler
        self._validate_certificate_handler = validate_certificate_handler
        self._validate_pdf_file_handler = validate_pdf_file_handler

    async def list_pre_certificates(self) -> Response:
        pre_certificates = await self._list_pre_certificates_handler.handle()
        return Response(content=json.dumps(pre_certificates), media_type="application/json")

    async def find_certificate_by_id(self, certificate_id: str) -> Response:
        certificate = await self._find_certificate_by_id_handler.handle(UUID(certificate_id))
        return Response(content=json.dumps(certificate), media_type="application/json")

    async def register_pre_certificate(self, command: RegisterPreCertificateCommand) -> Response:
        pre_certificate = await self._register_pre_certificate_handler.handle(command)
        return Response(
            content=json.dumps(pre_certificate), media_type="application/json", status_code=status.HTTP_201_CREATED
        )

    async def issue_certificate(self, certificate_id: str, command: IssueCertificateCommand) -> Response:
        certificate = await self._issue_certificate_handler.handle(UUID(certificate_id), command)
        return Response(
            content=json.dumps(certificate), media_type="application/json", status_code=status.HTTP_201_CREATED
        )

    async def find_qr_code_by_key(self, qr_code_key: str) -> Response:
        qr_code, mime_type = await self._find_qr_code_by_key_handler.handle(qr_code_key)
        return Response(content=qr_code, media_type=mime_type)

    async def register_pdf_hash(self, certificate_id: str, command: RegisterPDFHashCommand) -> Response:
        result = await self._register_pdf_hash_handler.handle(UUID(certificate_id), command)
        return Response(content=json.dumps(result), media_type="application/json", status_code=status.HTTP_201_CREATED)

    async def validate_certificate(self, certificate_hash: str) -> Response:
        result = await self._validate_certificate_handler.handle(certificate_hash)
        return Response(content=json.dumps(result), media_type="application/json")

    async def validate_pdf_file(self, command: ValidatePDFFileCommand) -> Response:
        result = await self._validate_pdf_file_handler.handle(command)
        return Response(content=json.dumps(result), media_type="application/json")
