from abc import ABC, abstractmethod
from typing import Any, Mapping, Tuple


class IFileService(ABC):
    @abstractmethod
    def generate_qr_code_file(self, data: Mapping[str, Any], file_name: str, canonical_hash: str) -> Tuple[bytes, str]:
        """Generate a QR code file from the given data and save it with the specified file name.

        Args:
            data (Mapping[str, Any]): The data to encode in the QR code.
            file_name (str): The name of the file to save the QR code image.
            canonical_hash (str): The canonical hash to be included in the QR code.

        Returns:
            Tuple[bytes, str]: A tuple containing the QR code image data in bytes and its content type.
        """
