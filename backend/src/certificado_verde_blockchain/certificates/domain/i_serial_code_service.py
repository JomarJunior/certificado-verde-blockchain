from abc import ABC, abstractmethod


class ISerialCodeService(ABC):
    @abstractmethod
    def generate_serial_code(self) -> str:
        """Generate a unique serial code for a certificate.

        Returns:
            str: The generated serial code.
        """
