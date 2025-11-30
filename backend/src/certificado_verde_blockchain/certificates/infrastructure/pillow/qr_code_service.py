import json
import os
from io import BytesIO
from typing import Any, Mapping

import qrcode
from qrcode.constants import ERROR_CORRECT_L

from ....configuration import QRCodeConfig
from ....shared.errors import DomainException
from ...domain import IQRCodeService
from .qr_code_payload import QRCodePayload


class QRCodeService(IQRCodeService):
    def __init__(
        self,
        config: QRCodeConfig,
    ) -> None:
        self.config = config

    def generate_qr_code(self, data: Mapping[str, Any], canonical_hash: str) -> bytes:
        """Generate a QR code image from the given data.

        Args:
            data (Mapping[str, Any]): The data to encode in the QR code.
        Returns:
            bytes: The generated QR code image in bytes.
        """
        try:
            certificate_id = data.get("id")
            if not certificate_id:
                raise DomainException("Certificate ID is missing in the data.")

            payload: QRCodePayload = {
                "certificate_id": certificate_id,
                "canonical_hash": canonical_hash,
                "verify_url": os.path.join(self.config.verify_url_template, certificate_id),
            }
            qr = qrcode.QRCode(
                version=self.config.version,
                error_correction=ERROR_CORRECT_L,
                box_size=self.config.box_size,
                border=self.config.border,
            )
            qr.add_data(json.dumps(payload))
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")

            byte_arr = BytesIO()
            img.save(byte_arr)
            return byte_arr.getvalue()
        except Exception as e:
            raise DomainException(f"Failed to generate QR code: {str(e)}") from e
