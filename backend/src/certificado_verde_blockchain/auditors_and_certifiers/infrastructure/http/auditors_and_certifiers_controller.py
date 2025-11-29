import json
from uuid import UUID

from fastapi import Response, status

from ...application import (
    FindAuditorByIdHandler,
    FindCertifierByIdHandler,
    ListAllAuditorsHandler,
    ListAllCertifiersHandler,
    RegisterAuditorCommand,
    RegisterAuditorHandler,
    RegisterCertifierCommand,
    RegisterCertifierHandler,
)


class AuditorsAndCertifiersController:
    def __init__(
        self,
        list_all_auditors_handler: ListAllAuditorsHandler,
        find_auditor_by_id_handler: FindAuditorByIdHandler,
        register_auditor_handler: RegisterAuditorHandler,
        list_all_certifiers_handler: ListAllCertifiersHandler,
        find_certifier_by_id_handler: FindCertifierByIdHandler,
        register_certifier_handler: RegisterCertifierHandler,
    ) -> None:
        self._list_all_auditors_handler = list_all_auditors_handler
        self._find_auditor_by_id_handler = find_auditor_by_id_handler
        self._register_auditor_handler = register_auditor_handler
        self._list_all_certifiers_handler = list_all_certifiers_handler
        self._find_certifier_by_id_handler = find_certifier_by_id_handler
        self._register_certifier_handler = register_certifier_handler

    async def list_all_auditors(self) -> Response:
        auditors = await self._list_all_auditors_handler.handle()
        return Response(content=json.dumps(auditors), media_type="application/json")

    async def find_auditor_by_id(self, auditor_id: str) -> Response:
        auditor = await self._find_auditor_by_id_handler.handle(UUID(auditor_id))
        return Response(content=json.dumps(auditor), media_type="application/json")

    async def register_auditor(self, command: RegisterAuditorCommand) -> Response:
        auditor = await self._register_auditor_handler.handle(command)
        return Response(content=json.dumps(auditor), media_type="application/json", status_code=status.HTTP_201_CREATED)

    async def list_all_certifiers(self) -> Response:
        certifiers = await self._list_all_certifiers_handler.handle()
        return Response(content=json.dumps(certifiers), media_type="application/json")

    async def find_certifier_by_id(self, certifier_id: str) -> Response:
        certifier = await self._find_certifier_by_id_handler.handle(UUID(certifier_id))
        return Response(content=json.dumps(certifier), media_type="application/json")

    async def register_certifier(self, command: RegisterCertifierCommand) -> Response:
        certifier = await self._register_certifier_handler.handle(command)
        return Response(
            content=json.dumps(certifier), media_type="application/json", status_code=status.HTTP_201_CREATED
        )
