from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .product import Product


class IProductRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Product]:
        pass

    @abstractmethod
    def find_by_id(self, product_id: UUID) -> Optional[Product]:
        pass

    @abstractmethod
    def save(self, product: Product) -> None:
        pass
