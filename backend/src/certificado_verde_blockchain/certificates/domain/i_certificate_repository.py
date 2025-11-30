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

    def find_by_id(self, certificate_id: UUID) -> Optional[Certificate]:
        """Find a certificate by its unique identifier.

        Args:
            certificate_id (UUID): The unique identifier of the certificate.

        Returns:
            Optional[Certificate]: The certificate if found, otherwise None.
        """

    def save(self, certificate: Certificate) -> None:
        """Save or update a certificate in the repository.

        Args:
            certificate (Certificate): The certificate to be saved or updated.
        """
