from typing import Annotated, ClassVar, Optional

from pydantic import BaseModel, ConfigDict, Field


class AuthenticityProof(BaseModel):
    """Value object that represents the authenticity proof of a certificate in the blockchain,
    guaranteeing its integrity and origin.

    Attributes:
        serial_code (str): Unique code generated for each certificate to ensure its authenticity.
        qr_code_url (str): URL of the QR code that can be scanned to verify the certificate's authenticity.
        certifier_signature (str): Digital signature that validates the certificate's data and origin.
        certifier_address (str): Blockchain address of the certifier who issued the certificate.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True)

    serial_code: Annotated[
        str, Field(description="Unique code generated for each certificate to ensure its authenticity.")
    ]
    qr_code_url: Annotated[
        Optional[str],
        Field(
            default=None, description="URL of the QR code that can be scanned to verify the certificate's authenticity."
        ),
    ] = None
    certifier_signature: Annotated[
        str, Field(description="Digital signature that validates the certificate's data and origin.")
    ]
    certifier_address: Annotated[
        str, Field(description="Blockchain address of the certifier who issued the certificate.")
    ]
