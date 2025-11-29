from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .auditor import Auditor


class IAuditorRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Auditor]:
        pass

    @abstractmethod
    def find_by_id(self, auditor_id: UUID) -> Optional[Auditor]:
        pass

    @abstractmethod
    def save(self, auditor: Auditor) -> None:
        pass
