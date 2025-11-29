from typing import List, Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DatabaseSession

from ....shared.errors import DomainException
from ...domain import IProducerRepository, Producer
from .producer_entity import ProducerEntity


class SqlProducerRepository(IProducerRepository):
    def __init__(self, database_session: DatabaseSession):
        self._db_session = database_session

    def list_all(self) -> List[Producer]:
        try:
            producer_entities = self._db_session.query(ProducerEntity).all()
            return [entity.to_domain() for entity in producer_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_id(self, producer_id: UUID) -> Optional[Producer]:
        try:
            producer_entity = self._db_session.query(ProducerEntity).filter_by(id=str(producer_id)).first()
            if producer_entity:
                return producer_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def save(self, producer: Producer) -> None:
        producer_entity = ProducerEntity.from_domain(producer)
        try:
            self._db_session.merge(producer_entity)  # Use merge to handle both insert and update
            self._db_session.commit()
        except IntegrityError as integrity_error:
            self._db_session.rollback()
            raise DomainException(
                (
                    f"Cannot save duplicate producer with document {producer.document.document_type}, "
                    f"number {producer.document.number}"
                ),
                code=409,  # Conflict
            ) from integrity_error
        except:
            # In case of an error, rollback the session
            self._db_session.rollback()
            raise
