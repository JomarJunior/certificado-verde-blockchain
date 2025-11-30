from typing import Optional
from uuid import UUID

from ....auditors_and_certifiers import FindCertifierByIdHandler
from ....shared.errors import DomainException
from ...domain import CanonicalCertifier, ICertifierService


class InternalCertifierService(ICertifierService):
    def __init__(self, find_certifier_by_id_handler: FindCertifierByIdHandler):
        self._find_certifier_by_id_handler = find_certifier_by_id_handler

    async def find_canonical_by_id(self, certifier_id: UUID) -> Optional[CanonicalCertifier]:
        certifier = await self._find_certifier_by_id_handler.handle(certifier_id)

        if not isinstance(certifier, dict):
            raise DomainException("Invalid certifier data format.")

        if (
            "id" not in certifier
            or "name" not in certifier
            or "document" not in certifier
            or "auditors" not in certifier
        ):
            raise DomainException("Missing required certifier fields.")

        document = certifier.get("document")
        if not isinstance(document, dict):
            raise DomainException("Invalid certifier document format.")

        auditors = certifier.get("auditors")
        if not isinstance(auditors, list):
            raise DomainException("Invalid certifier auditors format.")

        for auditor in auditors:
            if not isinstance(auditor, dict) or "name" not in auditor:
                raise DomainException("Invalid certifier auditor data format.")

        id = certifier.get("id")
        if not isinstance(id, str):
            raise DomainException("Invalid certifier ID format.")

        name = certifier.get("name")
        if not isinstance(name, str):
            raise DomainException("Invalid certifier name format.")

        document_type = document.get("document_type")
        if not isinstance(document_type, str):
            raise DomainException("Invalid certifier document type format.")

        document_number = document.get("number")
        if not isinstance(document_number, str):
            raise DomainException("Invalid certifier document number format.")

        auditors_names = [auditor.get("name") for auditor in auditors]

        return CanonicalCertifier(
            id=id,
            name=name,
            document_type=document_type,
            document_number=document_number,
            auditors_names=auditors_names,
        )

    async def certifier_exists(self, certifier_id: UUID) -> bool:
        try:
            await self._find_certifier_by_id_handler.handle(certifier_id)
            return True
        except DomainException as domain_exception:
            if domain_exception.code == 404:
                return False
            raise domain_exception
