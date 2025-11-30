from typing import Tuple

from ..domain import IStorageService


class FindQrCodeByKeyHandler:
    def __init__(
        self,
        storage_service: IStorageService,
    ):
        self._storage_service = storage_service

    async def handle(self, qr_code_key: str) -> Tuple[bytes, str]:
        qr_code_bytes = await self._storage_service.get_qr_code_from_key(qr_code_key)

        # Find mime type
        extension = qr_code_key.split(".")[-1].lower()
        mime_type = (
            f"image/{extension}" if extension in ["png", "jpeg", "jpg", "gif", "svg"] else "application/octet-stream"
        )

        return qr_code_bytes, mime_type
