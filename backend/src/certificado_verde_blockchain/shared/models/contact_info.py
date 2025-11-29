from typing import Annotated, ClassVar, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactInfo(BaseModel):
    """Model that represents contact information.

    Attributes:
        phone (Optional[str]): Contact phone number.
        email (Optional[EmailStr]): Contact email address.
        website (Optional[str]): Contact website URL.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True)

    phone: Annotated[Optional[str], Field(description="Contact phone number", min_length=1, max_length=20)] = None
    email: Annotated[Optional[EmailStr], Field(description="Contact email address", min_length=1, max_length=255)] = (
        None
    )
    website: Annotated[Optional[str], Field(description="Contact website URL", min_length=1, max_length=255)] = None
