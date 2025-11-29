from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .producer import Producer


class IProducerRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Producer]:
        pass

    @abstractmethod
    def find_by_id(self, producer_id: UUID) -> Optional[Producer]:
        pass

    @abstractmethod
    def save(self, producer: Producer) -> None:
        pass
