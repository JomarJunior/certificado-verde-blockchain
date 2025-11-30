from uuid import uuid4

from ..domain import ISerialCodeService


class SerialCodeService(ISerialCodeService):
    def generate_serial_code(self) -> str:
        """Generate a unique serial code for a certificate.

        Returns:
            str: The generated serial code.
        """
        return str(uuid4())
