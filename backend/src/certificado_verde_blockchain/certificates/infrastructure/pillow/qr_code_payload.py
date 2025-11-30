from typing import TypedDict


class QRCodePayload(TypedDict):
    certificate_id: str
    canonical_hash: str
    verify_url: str
