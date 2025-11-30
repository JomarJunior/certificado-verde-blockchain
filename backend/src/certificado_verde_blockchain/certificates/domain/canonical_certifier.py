from typing import List, TypedDict


class CanonicalCertifier(TypedDict):
    """TypedDict that represents the canonical form of a certifier,
    used within the canonical certificate for generating its canonical hash.

    Attributes:
        id (str): Unique identifier of the certifier.
        name (str): Name of the certifier.
        document_type (str): Type of identification document of the certifier.
        document_number (str): Identification document number of the certifier.
        auditors_names (List[str]): List of names of auditors associated with the certifier.
    """

    id: str
    name: str
    document_type: str
    document_number: str
    auditors_names: List[str]
