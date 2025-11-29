from typing import List, Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DatabaseSession

from ....shared.errors import DomainException
from ...domain import IProductRepository, Product
from .product_entity import ProductEntity


class SqlProductRepository(IProductRepository):
    def __init__(self, database_session: DatabaseSession):
        self._db_session = database_session

    def list_all(self) -> List[Product]:
        try:
            product_entities = self._db_session.query(ProductEntity).all()
            return [entity.to_domain() for entity in product_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_id(self, product_id: UUID) -> Optional[Product]:
        try:
            product_entity = self._db_session.query(ProductEntity).filter_by(id=str(product_id)).first()
            if product_entity:
                return product_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def save(self, product: Product) -> None:
        product_entity = ProductEntity.from_domain(product)
        try:
            self._db_session.merge(product_entity)  # Use merge to handle both insert and update
            self._db_session.commit()
        except IntegrityError as integrity_error:
            self._db_session.rollback()
            raise DomainException(
                "Cannot save duplicate product with the same defining attributes",
                code=409,  # Conflict
            ) from integrity_error
        except:
            # In case of an error, rollback the session
            self._db_session.rollback()
            raise
