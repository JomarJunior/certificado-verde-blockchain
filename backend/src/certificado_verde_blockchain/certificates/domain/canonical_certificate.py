from typing import List, TypedDict

from .canonical_certifier import CanonicalCertifier
from .canonical_producer import CanonicalProducer
from .canonical_product import CanonicalProduct


class CanonicalCertificate(TypedDict):
    """Value object that represents the canonical form of a green certificate,
    used for generating its canonical hash to ensure data integrity.

    Attributes:
        id (str): Unique identifier of the certificate.
        version (str): Version of the certificate schema.
        product (CanonicalProduct): Dictionary containing product details.
        producer (CanonicalProducer): Dictionary containing producer details.
        certifier (CanonicalCertifier): Dictionary containing certifier details.
        norms_complied (List[str]): List of norms that the product complies with.
        sustainability_criteria (List[str]): List of sustainability criteria met by the product.
        issued_at (str): ISO formatted date when the certificate was issued.
        valid_until (str): ISO formatted date when the certificate expires.
        serial_code (str): Unique code generated for each certificate to ensure its authenticity.
    """

    id: str
    version: str
    product: CanonicalProduct
    producer: CanonicalProducer
    certifier: CanonicalCertifier
    norms_complied: List[str]
    sustainability_criteria: List[str]
    issued_at: str
    valid_until: str
    serial_code: str
