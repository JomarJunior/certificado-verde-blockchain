from typing import Annotated

from pydantic import Field

from .base import BaseConfig


class QRCodeConfig(BaseConfig):
    version: Annotated[int, Field(description="The version of the QR code")]
    box_size: Annotated[int, Field(description="The size of each box in the QR code")]
    border: Annotated[int, Field(description="The border size of the QR code")]
    verify_url_template: Annotated[
        str,
        Field(description="The URL template for verifying the certificate payload"),
    ]
