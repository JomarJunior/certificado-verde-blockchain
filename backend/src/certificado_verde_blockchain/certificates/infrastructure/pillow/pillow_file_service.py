import io
from typing import Any, Mapping, Tuple

from PIL import Image

from ...domain import IFileService
from .qr_code_service import QRCodeService


class PillowFileService(IFileService):
    def __init__(self, qr_code_service: QRCodeService) -> None:
        self.qr_code_service = qr_code_service

    def generate_qr_code_file(self, data: Mapping[str, Any], file_name: str, canonical_hash: str) -> Tuple[bytes, str]:
        qr_code_contents_bytes = self.qr_code_service.generate_qr_code(data, canonical_hash)
        with Image.open(io.BytesIO(qr_code_contents_bytes)) as img:
            img.convert("RGB")  # Ensure image is in RGB format
            byte_arr = io.BytesIO()
            img.save(byte_arr, format="PNG")
            return byte_arr.getvalue(), "image/png"
