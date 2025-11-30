from datetime import datetime, timezone
from typing import Annotated, ClassVar, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from ...shared.errors import DomainException
from .authenticity_proof import AuthenticityProof
from .norm import Norm
from .sustainability_criteria import SustainabilityCriteria


def get_now_iso() -> str:
    """Get the current date and time in ISO format."""
    return datetime.now(timezone.utc).isoformat()


class Certificate(BaseModel):
    """Aggregate root that represents the green certificate issued to a sustainable product,
    containing all relevant information about the product, producer,
    certifier the sustainability criteria and authenticity proof.

    Attributes:
        id (UUID): Unique identifier of the certificate.
        version (str): Version of the certificate schema.
        product_id (UUID): Unique identifier of the certified product.
        producer_id (UUID): Unique identifier of the producer.
        certifier_id (UUID): Unique identifier of the certifier.
        norms_complied (List[Norm]): List of norms that the product complies with.
        sustainability_criteria (List[SustainabilityCriteria]): List of sustainability criteria met by the product.
        notes (Optional[str]): Additional notes about the certificate.
        issued_at (Optional[str]): ISO formatted date when the certificate was issued.
        valid_until (Optional[str]): ISO formatted date when the certificate expires.
        last_audited_at (Optional[str]): ISO formatted date of the last audit.
        authenticity_proof (Optional[AuthenticityProof]): Proof of authenticity of the certificate.
        canonical_hash (Optional[str]): Canonical hash of the certificate data for integrity verification.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(use_enum_values=True)

    id: Annotated[UUID, Field(default=uuid4(), description="Unique identifier of the certificate.")] = uuid4()
    version: Annotated[str, Field(description="Version of the certificate schema.", min_length=1, max_length=50)]
    product_id: Annotated[UUID, Field(description="Unique identifier of the certified product.")]
    producer_id: Annotated[UUID, Field(description="Unique identifier of the producer.")]
    certifier_id: Annotated[UUID, Field(description="Unique identifier of the certifier.")]
    norms_complied: Annotated[
        List[Norm], Field(default=[], description="List of norms that the product complies with.")
    ] = []
    sustainability_criteria: Annotated[
        List[SustainabilityCriteria],
        Field(default=[], description="List of sustainability criteria met by the product."),
    ] = []
    notes: Annotated[Optional[str], Field(description="Additional notes about the certificate.")] = None

    # Issued certificate details
    issued_at: Annotated[
        Optional[str], Field(default=None, description="ISO formatted date when the certificate was issued.")
    ] = None
    valid_until: Annotated[
        Optional[str], Field(default=None, description="ISO formatted date when the certificate expires.")
    ] = None
    last_audited_at: Annotated[
        Optional[str], Field(default=None, description="ISO formatted date of the last audit.")
    ] = None
    authenticity_proof: Annotated[
        Optional[AuthenticityProof], Field(default=None, description="Proof of authenticity of the certificate.")
    ] = None
    canonical_hash: Annotated[
        Optional[str],
        Field(default=None, description="Canonical hash of the certificate data for integrity verification."),
    ] = None
    blockchain_id: Annotated[Optional[str], Field(description="Identifier of the certificate in the blockchain.")] = (
        None
    )

    @field_serializer("id", "product_id", "producer_id", "certifier_id")
    def serialize_id(self, id: UUID) -> str:
        """Serialize the UUID id to a string."""
        return str(id)

    @property
    def is_pre_issued(self) -> bool:
        """Check if the certificate is in a pre-issued state (i.e., not yet issued).

        Returns:
            bool: True if the certificate is pre-issued, False otherwise.
        """
        return (
            self.issued_at is None
            or self.valid_until is None
            or self.authenticity_proof is None
            or self.canonical_hash is None
            or self.blockchain_id is None
        )

    def issue(
        self,
        issued_at: datetime,
        valid_until: datetime,
        authenticity_proof: AuthenticityProof,
        canonical_hash: str,
        blockchain_id: str,
    ) -> None:
        """Issue the certificate by setting its issued date, validity date,
        authenticity proof, canonical hash, and blockchain ID.

        Args:
            issued_at (datetime): The date and time when the certificate is issued.
            valid_until (datetime): The date and time when the certificate expires.
            authenticity_proof (AuthenticityProof): The authenticity proof of the certificate.
            canonical_hash (str): The canonical hash of the certificate data.
            blockchain_id (str): The identifier of the certificate in the blockchain.

        Raises:
            DomainException: If the certificate has already been issued.
        """
        if not self.is_pre_issued:
            raise DomainException("Certificate has already been issued.", 400)

        self.issued_at = issued_at.isoformat()
        self.valid_until = valid_until.isoformat()
        self.authenticity_proof = authenticity_proof
        self.canonical_hash = canonical_hash
        self.blockchain_id = blockchain_id

    def has_expired(self) -> bool:
        """Check if the certificate has expired based on the current date and the valid_until date.

        Returns:
            bool: True if the certificate has expired, False otherwise.
        """
        if self.is_pre_issued or self.valid_until is None:
            return False
        current_time = datetime.now(timezone.utc)
        valid_until_time = datetime.fromisoformat(self.valid_until)
        return current_time > valid_until_time

    def is_audited(self) -> bool:
        """Check if the certificate has been audited at least once.

        Returns:
            bool: True if the certificate has been audited, False otherwise.
        """
        return self.last_audited_at is not None

    def audit(self) -> None:
        """Update the last_audited_at attribute to the current date and time in ISO format."""
        self.last_audited_at = datetime.now(timezone.utc).isoformat()

    def revoke(self) -> None:
        """Revoke the certificate by setting its valid_until date to the current date and time."""
        if self.is_pre_issued:
            raise DomainException("Cannot revoke a pre-issued certificate.", 400)
        self.valid_until = datetime.now(timezone.utc).isoformat()
