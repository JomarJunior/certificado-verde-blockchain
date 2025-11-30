from abc import ABC, abstractmethod
from typing import Any, Mapping


class IQRCodeService(ABC):
    @abstractmethod
    def generate_qr_code(self, data: Mapping[str, Any], canonical_hash: str) -> bytes:
        """Generate a QR code image from the given data.

        Args:
            data (Mapping[str, Any]): The data to encode in the QR code.
        Returns:
            bytes: The generated QR code image in bytes.
        """
