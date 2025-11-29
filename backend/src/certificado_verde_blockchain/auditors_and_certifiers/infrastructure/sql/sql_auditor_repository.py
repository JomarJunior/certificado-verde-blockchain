from typing import List, Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DatabaseSession

from ....shared.errors import DomainException
from ...domain import Auditor, IAuditorRepository
from .auditor_entity import AuditorEntity


class SqlAuditorRepository(IAuditorRepository):
    def __init__(self, database_session: DatabaseSession):
        self._db_session = database_session

    def list_all(self) -> List[Auditor]:
        try:
            auditor_entities = self._db_session.query(AuditorEntity).all()
            return [entity.to_domain() for entity in auditor_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_id(self, auditor_id: UUID) -> Optional[Auditor]:
        try:
            auditor_entity = self._db_session.query(AuditorEntity).filter_by(id=str(auditor_id)).first()
            if auditor_entity:
                return auditor_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def save(self, auditor: Auditor) -> None:
        auditor_entity = AuditorEntity.from_domain(auditor)
        try:
            self._db_session.merge(auditor_entity)  # Use merge to handle both insert and update
            self._db_session.commit()
        except IntegrityError as integrity_error:
            self._db_session.rollback()
            raise DomainException(
                (
                    f"Cannot save duplicate auditor with document {auditor.document.document_type}, "
                    f"number {auditor.document.number}"
                ),
                code=409,  # Conflict
            ) from integrity_error
        except:
            # In case of an error, rollback the session
            self._db_session.rollback()
            raise
