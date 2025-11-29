from typing import Annotated, ClassVar

from pydantic import BaseModel, ConfigDict, Field

from ..enums import DocumentType


class Document(BaseModel):
    """Model that represents a document.

    Attributes:
        document_type (DocumentType): Type of the document.
        number (str): Document number.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(use_enum_values=True, frozen=True)

    document_type: Annotated[DocumentType, Field(..., description="Type of the document")]
    number: Annotated[str, Field(..., description="Document number", min_length=1, max_length=100)]
