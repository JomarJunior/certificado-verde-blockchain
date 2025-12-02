from typing import Annotated, Any, Dict, Optional

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.errors import DomainException
from ..domain import Certificate, IBlockchainService, ICertificateRepository


class ValidatePDFFileCommand(BaseModel):
    """Command to validate a PDF file for a certificate.

    Attributes:
        pdf_file (bytes): The PDF file in bases64 encoded format.
    """

    pdf_file: Annotated[str, Field(description="The PDF file in base64 encoded format.")]


class ValidatePDFFileHandler:
    def __init__(
        self,
        repository: ICertificateRepository,
        blockchain_service: IBlockchainService,
        logger: IAsyncLogger,
    ):
        self._repository = repository
        self._blockchain_service = blockchain_service
        self._logger = logger

    async def handle(self, command: ValidatePDFFileCommand) -> Dict[str, Any]:
        """Handles the validation of a PDF file for a certificate.

        Args:
            command (ValidatePDFFileCommand): The command containing the PDF file.
        Returns:
            Dict[str, Any]: A dictionary containing the result of the operation.
        """
        pdf_hash = await self._blockchain_service.hash_data(
            {
                "pdf_file": command.pdf_file,
            }
        )

        await self._logger.info(f"Validating PDF file with hash: {pdf_hash}")

        certificate: Optional[Certificate] = self._repository.find_by_pdf_hash(pdf_hash)
        if not certificate:
            raise DomainException("No certificate found matching the provided PDF file.", code=404)

        return {
            "certificate_id": str(certificate.id),
            "pdf_hash": pdf_hash,
            "is_valid": True,
        }
