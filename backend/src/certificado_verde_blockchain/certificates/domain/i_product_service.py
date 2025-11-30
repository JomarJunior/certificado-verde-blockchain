from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from .canonical_product import CanonicalProduct


class IProductService(ABC):
    @abstractmethod
    async def find_canonical_by_id(self, product_id: UUID) -> Optional[CanonicalProduct]:
        """Find a product by its unique identifier and return its canonical form.

        Args:
            product_id (UUID): The unique identifier of the product.
        Returns:
            Optional[CanonicalProduct]: The canonical form of the product if found, otherwise None.
        """

    @abstractmethod
    async def product_exists(self, product_id: UUID) -> bool:
        """Check if a product exists by its unique identifier.

        Args:
            product_id (UUID): The unique identifier of the product.
        Returns:
            bool: True if the product exists, otherwise False.
        """
