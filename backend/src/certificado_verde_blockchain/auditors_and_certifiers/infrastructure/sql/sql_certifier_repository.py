from typing import List, Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DatabaseSession

from ....shared.errors import DomainException
from ...domain import Certifier, ICertifierRepository
from .certifier_entity import CertifierEntity


class SqlCertifierRepository(ICertifierRepository):
    def __init__(self, database_session: DatabaseSession):
        self._db_session = database_session

    def list_all(self) -> List[Certifier]:
        try:
            certifier_entities = self._db_session.query(CertifierEntity).all()
            return [entity.to_domain() for entity in certifier_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_id(self, certifier_id: UUID) -> Optional[Certifier]:
        try:
            certifier_entity = self._db_session.query(CertifierEntity).filter_by(id=str(certifier_id)).first()
            if certifier_entity:
                return certifier_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def save(self, certifier: Certifier) -> None:
        certifier_entity = CertifierEntity.from_domain(certifier)
        try:
            self._db_session.merge(certifier_entity)  # Use merge to handle both insert and update
            self._db_session.commit()
        except IntegrityError as integrity_error:
            self._db_session.rollback()
            raise DomainException(
                (
                    f"Cannot save duplicate certifier with document {certifier.document.document_type}, "
                    f"number {certifier.document.number}"
                ),
                code=409,  # Conflict
            ) from integrity_error
        except:
            # In case of an error, rollback the session
            self._db_session.rollback()
            raise
