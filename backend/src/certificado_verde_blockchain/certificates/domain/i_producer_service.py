from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from .canonical_producer import CanonicalProducer


class IProducerService(ABC):
    @abstractmethod
    async def find_canonical_by_id(self, producer_id: UUID) -> Optional[CanonicalProducer]:
        """Find a producer by its unique identifier and return its canonical form.

        Args:
            producer_id (UUID): The unique identifier of the producer.
        Returns:
            Optional[CanonicalProducer]: The canonical form of the producer if found, otherwise None.
        """

    @abstractmethod
    async def producer_exists(self, producer_id: UUID) -> bool:
        """Check if a producer exists by its unique identifier.

        Args:
            producer_id (UUID): The unique identifier of the producer.
        Returns:
            bool: True if the producer exists, otherwise False.
        """
