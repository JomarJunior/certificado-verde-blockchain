from ...shared.errors import DomainException
from .canonical_certificate import CanonicalCertificate
from .certificate import Certificate
from .i_certifier_service import ICertifierService
from .i_producer_service import IProducerService
from .i_product_service import IProductService


class CanonicalCertificateService:
    """Service responsible for constructing the canonical representation of a green certificate,
    aggregating data from certifier, producer, and product services.

    Attributes:
        certifier_service (ICertifierService): Service to retrieve certifier data.
        producer_service (IProducerService): Service to retrieve producer data.
        product_service (IProductService): Service to retrieve product data.

    Methods:
        build_canonical(certificate: Certificate) -> CanonicalCertificate:
            Constructs the canonical representation of the given certificate.

    Examples:
        >>> certifier_service = SomeCertifierServiceImplementation()
        >>> producer_service = SomeProducerServiceImplementation()
        >>> product_service = SomeProductServiceImplementation()
        >>> canonical_service = CanonicalCertificateService(
        ...     certifier_service, producer_service, product_service
        ... )
        >>> canonical_certificate = canonical_service.build_canonical(certificate)
    """

    def __init__(
        self,
        certifier_service: ICertifierService,
        producer_service: IProducerService,
        product_service: IProductService,
    ) -> None:
        self.certifier_service = certifier_service
        self.producer_service = producer_service
        self.product_service = product_service

    async def build_canonical(
        self, certificate: Certificate, issued_at: str, valid_until: str, serial_code: str
    ) -> CanonicalCertificate:
        """Constructs the canonical representation of the given certificate.
        Args:
            certificate (Certificate): The certificate to be transformed into its canonical form.
            issued_at (str): The issuance date of the certificate.
            valid_until (str): The expiration date of the certificate.
            serial_code (str): The serial code of the certificate.
        Returns:
            CanonicalCertificate: The canonical representation of the certificate.
        Raises:
            DomainException: If any of the related entities (certifier, producer, product) cannot be found.
        """

        certifier = await self.certifier_service.find_canonical_by_id(certificate.certifier_id)
        if not certifier:
            raise DomainException(f"Certifier with ID {certificate.certifier_id} not found.", 404)

        producer = await self.producer_service.find_canonical_by_id(certificate.producer_id)
        if not producer:
            raise DomainException(f"Producer with ID {certificate.producer_id} not found.", 404)

        product = await self.product_service.find_canonical_by_id(certificate.product_id)
        if not product:
            raise DomainException(f"Product with ID {certificate.product_id} not found.", 404)

        canonical_certificate = CanonicalCertificate(
            id=str(certificate.id),
            version=certificate.version,
            product=product,
            producer=producer,
            certifier=certifier,
            norms_complied=[str(norm) for norm in certificate.norms_complied],
            sustainability_criteria=[str(criteria) for criteria in certificate.sustainability_criteria],
            issued_at=issued_at,
            valid_until=valid_until,
            serial_code=serial_code,
        )

        return canonical_certificate
