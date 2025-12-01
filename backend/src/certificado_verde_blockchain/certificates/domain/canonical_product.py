from typing import Optional, TypedDict

from click import Option


class CanonicalProduct(TypedDict):
    """TypedDict that represents the canonical form of a product,
    used within the canonical certificate for generating its canonical hash.

    Attributes:
        id (str): Unique identifier of the product.
        name (str): Name of the product.
        category (str): Category of the product.
        quantity_value (float): Quantity of the product.
        quantity_unit (str): Unit of measurement for the product quantity.
        origin_country (str): Country of origin of the product.
        origin_state (str): State of origin of the product.
        origin_city (str): City of origin of the product.
        origin_latitude (float): Latitude coordinate of the product's origin.
        origin_longitude (float): Longitude coordinate of the product's origin.
        lot_number (str): Lot number of the product.
    """

    id: str
    name: str
    category: str
    quantity_value: float
    quantity_unit: str
    origin_country: str
    origin_state: Optional[str]
    origin_city: Optional[str]
    origin_latitude: float
    origin_longitude: float
    lot_number: Optional[str]
