from typing import List, Optional
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from ....shared.sql import Base
from ...domain import AuthenticityProof, Certificate, Norm, SustainabilityCriteria


class CertificateEntity(Base):
    """SQLAlchemy entity that maps to the certificates table in the database.
    It provides methods to convert between the domain Certificate model and the database representation.

    Attributes:
        id (str): Unique identifier for the certificate.
        version (str): Version of the certificate schema.
        product_id (str): Unique identifier of the certified product. fk products.id
        producer_id (str): Unique identifier of the producer. fk producers.id
        certifier_id (str): Unique identifier of the certifier. fk certifiers.id
        norms_complied (List[str]): List of norms that the product complies with.
        sustainability_criteria (List[str]): List of sustainability criteria met by the product.
        notes (Optional[str]): Additional notes about the certificate.
        issued_at (Optional[str]): ISO formatted date when the certificate was issued.
        valid_until (Optional[str]): ISO formatted date when the certificate expires.
        last_audited_at (Optional[str]): ISO formatted date of the last audit.
        authenticity_serial_code (Optional[str]): Serial code for the authenticity proof of the certificate.
        authenticity_qr_code_url (Optional[str]): URL of the QR code for the authenticity proof.
        authenticity_certifier_signature (Optional[str]): Digital signature for the authenticity proof.
        authenticity_certifier_address (Optional[str]): Blockchain address of the certifier for the authenticity proof.
        authenticity_pdf_hash (Optional[str]): Hash of the PDF document associated with the certificate.
        canonical_hash (Optional[str]): Canonical hash of the certificate data for integrity verification.
        blockchain_id (Optional[str]): Identifier of the certificate in the blockchain.
    """

    __tablename__ = "certificates"

    id: Mapped[str] = mapped_column(PGUUID(as_uuid=False), primary_key=True, default=sa.text("gen_random_uuid()"))
    version: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    product_id: Mapped[str] = mapped_column(PGUUID(as_uuid=False), sa.ForeignKey("products.id"), nullable=False)
    producer_id: Mapped[str] = mapped_column(PGUUID(as_uuid=False), sa.ForeignKey("producers.id"), nullable=False)
    certifier_id: Mapped[str] = mapped_column(PGUUID(as_uuid=False), sa.ForeignKey("certifiers.id"), nullable=False)
    norms_complied: Mapped[List[str]] = mapped_column(ARRAY(sa.String), nullable=False, name="norms_complied")
    sustainability_criteria: Mapped[List[str]] = mapped_column(
        ARRAY(sa.String), nullable=False, name="sustainability_criteria"
    )
    notes: Mapped[Optional[str]] = mapped_column(sa.Text, nullable=True)
    issued_at: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    valid_until: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    last_audited_at: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    authenticity_serial_code: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    authenticity_qr_code_url: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    authenticity_certifier_signature: Mapped[Optional[str]] = mapped_column(sa.Text, nullable=True)
    authenticity_certifier_address: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    authenticity_pdf_hash: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    canonical_hash: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    blockchain_id: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)

    @classmethod
    def from_domain(cls, certificate: Certificate) -> "CertificateEntity":
        """Creates a CertificateEntity from a domain Certificate model.

        Args:
            certificate (Certificate): The domain Certificate model.
        Returns:
            CertificateEntity: The corresponding CertificateEntity.
        """
        return cls(
            id=str(certificate.id),
            version=certificate.version,
            product_id=str(certificate.product_id),
            producer_id=str(certificate.producer_id),
            certifier_id=str(certificate.certifier_id),
            norms_complied=[str(norm) for norm in certificate.norms_complied],
            sustainability_criteria=[str(criteria) for criteria in certificate.sustainability_criteria],
            notes=certificate.notes,
            issued_at=certificate.issued_at,
            valid_until=certificate.valid_until,
            last_audited_at=certificate.last_audited_at,
            authenticity_serial_code=(
                certificate.authenticity_proof.serial_code if certificate.authenticity_proof else None
            ),
            authenticity_qr_code_url=(
                certificate.authenticity_proof.qr_code_url if certificate.authenticity_proof else None
            ),
            authenticity_certifier_signature=(
                certificate.authenticity_proof.certifier_signature if certificate.authenticity_proof else None
            ),
            authenticity_certifier_address=(
                certificate.authenticity_proof.certifier_address if certificate.authenticity_proof else None
            ),
            authenticity_pdf_hash=(certificate.authenticity_proof.pdf_hash if certificate.authenticity_proof else None),
            canonical_hash=certificate.canonical_hash,
            blockchain_id=certificate.blockchain_id,
        )

    def to_domain(self) -> Certificate:
        """Converts the CertificateEntity to a domain Certificate model.

        Returns:
            Certificate: The corresponding domain Certificate model.
        """
        authenticity_proof = None
        if (
            self.authenticity_serial_code is not None
            and self.authenticity_qr_code_url is not None
            and self.authenticity_certifier_signature is not None
            and self.authenticity_certifier_address is not None
        ):
            authenticity_proof = AuthenticityProof(
                serial_code=self.authenticity_serial_code,
                qr_code_url=self.authenticity_qr_code_url,
                certifier_signature=self.authenticity_certifier_signature,
                certifier_address=self.authenticity_certifier_address,
                pdf_hash=self.authenticity_pdf_hash,
            )

        return Certificate(
            id=UUID(self.id),
            version=self.version,
            product_id=UUID(self.product_id),
            producer_id=UUID(self.producer_id),
            certifier_id=UUID(self.certifier_id),
            norms_complied=[Norm(norm) for norm in self.norms_complied],
            sustainability_criteria=[SustainabilityCriteria(criteria) for criteria in self.sustainability_criteria],
            notes=self.notes,
            issued_at=self.issued_at,
            valid_until=self.valid_until,
            last_audited_at=self.last_audited_at,
            authenticity_proof=authenticity_proof,
            canonical_hash=self.canonical_hash,
            blockchain_id=self.blockchain_id,
        )
