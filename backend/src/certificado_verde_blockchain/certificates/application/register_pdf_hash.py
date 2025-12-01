from typing import Annotated, Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Certificate, IBlockchainService, ICertificateRepository


class RegisterPDFHashCommand(BaseModel):
    """Command to register a PDF hash for a certificate.

    Attributes:
        pdf_file (str): The PDF file in base64 encoded format.
    """

    pdf_file: Annotated[str, Field(description="The PDF file in base64 encoded format.")]


class RegisterPDFHashHandler:
    def __init__(
        self,
        repository: ICertificateRepository,
        blockchain_service: IBlockchainService,
        logger: IAsyncLogger,
    ):
        self._repository = repository
        self._blockchain_service = blockchain_service
        self._logger = logger

    async def handle(self, certificate_id: UUID, command: RegisterPDFHashCommand) -> Dict[str, Any]:
        """Handles the registration of a PDF hash for a certificate.

        Args:
            command (RegisterPDFHashCommand): The command containing the PDF file.
        Returns:
            Dict[str, Any]: A dictionary containing the result of the operation.
        """
        certificate: Optional[Certificate] = self._repository.find_by_id(certificate_id)
        if not certificate:
            raise DomainException(f"Certificate with ID {certificate_id} not found.")

        if not certificate.authenticity_proof:
            raise DomainException(f"Certificate with ID {certificate_id} was not signed.")

        if certificate.authenticity_proof.pdf_hash is not None:
            raise DomainException(f"Certificate with ID {certificate_id} already has a PDF hash registered.")

        pdf_hash = await self._blockchain_service.hash_data(
            {
                "pdf_file": command.pdf_file,
            }
        )

        certificate.set_pdf_hash(pdf_hash)  # Doesn't change the canonical representation

        self._repository.save(certificate)

        return {
            "certificate_id": str(certificate.id),
            "pdf_hash": pdf_hash,
        }
