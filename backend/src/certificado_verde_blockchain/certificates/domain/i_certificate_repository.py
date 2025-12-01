from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .certificate import Certificate


class ICertificateRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Certificate]:
        """Retrieve all certificates from the repository.

        Returns:
            List[Certificate]: A list of all certificates.
        """

    @abstractmethod
    def find_by_id(self, certificate_id: UUID) -> Optional[Certificate]:
        """Find a certificate by its unique identifier.

        Args:
            certificate_id (UUID): The unique identifier of the certificate.

        Returns:
            Optional[Certificate]: The certificate if found, otherwise None.
        """

    @abstractmethod
    def find_by_canonical_hash(self, canonical_hash: str) -> Optional[Certificate]:
        """Find a certificate by its canonical hash.

        Args:
            canonical_hash (str): The canonical hash of the certificate.

        Returns:
            Optional[Certificate]: The certificate if found, otherwise None.
        """

    @abstractmethod
    def find_by_product_id(self, product_id: UUID) -> List[Certificate]:
        """Find certificates by the associated product ID.

        Args:
            product_id (UUID): The unique identifier of the product.

        Returns:
            List[Certificate]: A list of certificates associated with the product.
        """

    @abstractmethod
    def find_by_producer_id(self, producer_id: UUID) -> List[Certificate]:
        """Find certificates by the associated producer ID.

        Args:
            producer_id (UUID): The unique identifier of the producer.

        Returns:
            List[Certificate]: A list of certificates associated with the producer.
        """

    @abstractmethod
    def find_by_certifier_id(self, certifier_id: UUID) -> List[Certificate]:
        """Find certificates by the associated certifier ID.

        Args:
            certifier_id (UUID): The unique identifier of the certifier.

        Returns:
            List[Certificate]: A list of certificates associated with the certifier.
        """

    @abstractmethod
    def find_by_pdf_hash(self, pdf_hash: str) -> Optional[Certificate]:
        """Find a certificate by its PDF hash.

        Args:
            pdf_hash (str): The PDF hash of the certificate.

        Returns:
            Optional[Certificate]: The certificate if found, otherwise None.
        """

    @abstractmethod
    def save(self, certificate: Certificate) -> None:
        """Save or update a certificate in the repository.

        Args:
            certificate (Certificate): The certificate to be saved or updated.
        """
