from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .certifier import Certifier


class ICertifierRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Certifier]:
        pass

    @abstractmethod
    def find_by_id(self, certifier_id: UUID) -> Optional[Certifier]:
        pass

    @abstractmethod
    def save(self, certifier: Certifier) -> None:
        pass
