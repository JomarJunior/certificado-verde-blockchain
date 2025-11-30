from typing import TypedDict


class CanonicalProducer(TypedDict):
    """TypedDict that represents the canonical form of a producer,
    used within the canonical certificate for generating its canonical hash.

    Attributes:
        id (str): Unique identifier of the producer.
        name (str): Name of the producer.
        document_type (str): Type of identification document of the producer.
        document_number (str): Identification document number of the producer.
        car_code (str): Unique agricultural registry code of the producer.
        address_country (str): Country of the producer's address.
        address_state (str): State of the producer's address.
        address_city (str): City of the producer's address.
        address_latitude (float): Latitude coordinate of the producer's address.
        address_longitude (float): Longitude coordinate of the producer's address.
    """

    id: str
    name: str
    document_type: str
    document_number: str
    car_code: str
    address_country: str
    address_state: str
    address_city: str
    address_latitude: float
    address_longitude: float
