from abc import ABC, abstractmethod


class IStorageService(ABC):
    @abstractmethod
    async def upload_qr_code(self, file_name: str, data: bytes, content_type: str) -> str:
        """Upload a QR code image to storage.

        Args:
            file_name (str): The name of the file to be stored.
            data (bytes): The QR code image data in bytes.
            content_type (str): The MIME type of the QR code image.

        Returns:
            str: The key of the uploaded QR code image in storage.
        """

    @abstractmethod
    async def get_qr_code_from_key(self, key: str) -> bytes:
        """Retrieve a QR code image from storage using its key.

        Args:
            key (str): The key of the QR code image in storage.
        Returns:
            bytes: The QR code image data in bytes.
        """
