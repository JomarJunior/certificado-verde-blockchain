from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from .canonical_certifier import CanonicalCertifier


class ICertifierService(ABC):
    @abstractmethod
    async def find_canonical_by_id(self, certifier_id: UUID) -> Optional[CanonicalCertifier]:
        """Find a certifier by its unique identifier and return its canonical form.

        Args:
            certifier_id (UUID): The unique identifier of the certifier.
        Returns:
            Optional[CanonicalCertifier]: The canonical form of the certifier if found, otherwise None.
        """

    @abstractmethod
    async def certifier_exists(self, certifier_id: UUID) -> bool:
        """Check if a certifier exists by its unique identifier.

        Args:
            certifier_id (UUID): The unique identifier of the certifier.
        Returns:
            bool: True if the certifier exists, otherwise False.
        """
