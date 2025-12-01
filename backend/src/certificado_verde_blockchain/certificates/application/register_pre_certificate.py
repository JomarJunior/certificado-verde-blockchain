from typing import Annotated, Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ..domain import (
    Certificate,
    ICertificateRepository,
    ICertifierService,
    IProducerService,
    IProductService,
    Norm,
    SustainabilityCriteria,
)


class RegisterPreCertificateCommand(BaseModel):
    """Command to register a pre-certificate for a sustainable product.

    Attributes:
        product_id (UUID): Unique identifier of the product to be certified.
        version (str): Version of the certificate schema.
        producer_id (UUID): Unique identifier of the producer.
        certifier_id (UUID): Unique identifier of the certifier.
        norms_complied (List[Norm]): List of norms that the product complies with.
        sustainability_criteria (List[SustainabilityCriteria]): List of sustainability criteria met by the product.
        notes (Optional[str]): Additional notes about the pre-certificate.
    """

    product_id: Annotated[UUID, Field(description="Unique identifier of the product to be certified.")]
    version: Annotated[str, Field(description="Version of the certificate schema.")]
    producer_id: Annotated[UUID, Field(description="Unique identifier of the producer.")]
    certifier_id: Annotated[UUID, Field(description="Unique identifier of the certifier.")]
    norms_complied: Annotated[List[Norm], Field(description="List of norms that the product complies with.")] = []
    sustainability_criteria: Annotated[
        List[SustainabilityCriteria], Field(description="List of sustainability criteria met by the product.")
    ] = []
    notes: Annotated[Optional[str], Field(description="Additional notes about the pre-certificate.")] = None


class RegisterPreCertificateHandler:
    def __init__(
        self,
        repository: ICertificateRepository,
        certifier_service: ICertifierService,
        producer_service: IProducerService,
        product_service: IProductService,
        logger: IAsyncLogger,
    ):
        self._repository = repository
        self._certifier_service = certifier_service
        self._producer_service = producer_service
        self._product_service = product_service
        self._logger = logger

    async def handle(self, command: RegisterPreCertificateCommand) -> Dict[str, Any]:
        """Handles the registration of a pre-certificate.

        Args:
            command (RegisterPreCertificateCommand): The command containing pre-certificate details.
        Returns:
            Certificate: The registered pre-certificate.
        """
        await self._logger.info(f"Registering pre-certificate for product {command.product_id}.")

        pre_certificate = Certificate(
            id=uuid4(),
            version=command.version,
            product_id=command.product_id,
            producer_id=command.producer_id,
            certifier_id=command.certifier_id,
            norms_complied=command.norms_complied,
            sustainability_criteria=command.sustainability_criteria,
            notes=command.notes,
        )

        self._repository.save(pre_certificate)
        await self._logger.info(f"Pre-certificate {pre_certificate.id} registered successfully.")
        return {"pre_certificate": pre_certificate.model_dump()}
