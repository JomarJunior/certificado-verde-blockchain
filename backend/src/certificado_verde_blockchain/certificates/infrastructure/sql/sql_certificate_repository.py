from typing import List, Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DatabaseSession

from ....shared.errors import DomainException
from ...domain import Certificate, ICertificateRepository
from .certificate_entity import CertificateEntity


class SqlCertificateRepository(ICertificateRepository):
    def __init__(self, database_session: DatabaseSession):
        self._db_session = database_session

    def list_all(self) -> List[Certificate]:
        try:
            certificate_entities = self._db_session.query(CertificateEntity).all()
            return [entity.to_domain() for entity in certificate_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_id(self, certificate_id: UUID) -> Optional[Certificate]:
        try:
            certificate_entity = self._db_session.query(CertificateEntity).filter_by(id=str(certificate_id)).first()
            if certificate_entity:
                return certificate_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def find_by_canonical_hash(self, canonical_hash: str) -> Optional[Certificate]:
        try:
            certificate_entity = (
                self._db_session.query(CertificateEntity).filter_by(canonical_hash=canonical_hash).first()
            )
            if certificate_entity:
                return certificate_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def find_by_product_id(self, product_id: UUID) -> List[Certificate]:
        try:
            certificate_entities = self._db_session.query(CertificateEntity).filter_by(product_id=str(product_id)).all()
            return [entity.to_domain() for entity in certificate_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_producer_id(self, producer_id: UUID) -> List[Certificate]:
        try:
            certificate_entities = (
                self._db_session.query(CertificateEntity).filter_by(producer_id=str(producer_id)).all()
            )
            return [entity.to_domain() for entity in certificate_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_certifier_id(self, certifier_id: UUID) -> List[Certificate]:
        try:
            certificate_entities = (
                self._db_session.query(CertificateEntity).filter_by(certifier_id=str(certifier_id)).all()
            )
            return [entity.to_domain() for entity in certificate_entities]
        except:
            self._db_session.rollback()
            raise

    def find_by_pdf_hash(self, pdf_hash: str) -> Optional[Certificate]:
        try:
            certificate_entity = (
                self._db_session.query(CertificateEntity).filter_by(authenticity_pdf_hash=pdf_hash).first()
            )
            if certificate_entity:
                return certificate_entity.to_domain()
            return None
        except:
            self._db_session.rollback()
            raise

    def save(self, certificate: Certificate) -> None:
        certificate_entity = CertificateEntity.from_domain(certificate)
        try:
            self._db_session.merge(certificate_entity)  # Use merge to handle both insert and update
            self._db_session.commit()
        except IntegrityError as integrity_error:
            self._db_session.rollback()
            raise DomainException(
                (
                    f"Integrity error while saving certificate with ID {certificate.id}: "
                    "possible duplicate or constraint violation."
                ),
                code=409,  # Conflict
            ) from integrity_error
        except:
            # In case of an error, rollback the session
            self._db_session.rollback()
            raise
