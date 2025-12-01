from typing import Optional
from uuid import UUID

from ....products import FindProductByIdHandler
from ....shared.errors import DomainException
from ...domain import CanonicalProduct, IProductService


class InternalProductService(IProductService):
    def __init__(self, find_product_by_id_handler: FindProductByIdHandler):
        self._find_product_by_id_handler = find_product_by_id_handler

    async def find_canonical_by_id(self, product_id: UUID) -> Optional[CanonicalProduct]:
        product = await self._find_product_by_id_handler.handle(product_id)

        if not isinstance(product, dict):
            raise DomainException("Invalid product data format.")

        if (
            "id" not in product
            or "name" not in product
            or "category" not in product
            or "quantity" not in product
            or "origin" not in product
            or "lot_number" not in product
        ):
            raise DomainException("Missing required product fields.")

        origin = product.get("origin")
        if not isinstance(origin, dict):
            raise DomainException("Invalid product origin format.")

        if "coordinates" not in origin:
            raise DomainException("Missing required product origin coordinates fields.")

        coordinates = origin.get("coordinates")
        if not isinstance(coordinates, dict):
            raise DomainException("Invalid product origin coordinates format.")

        quantity = product.get("quantity")
        if not isinstance(quantity, dict):
            raise DomainException("Invalid product quantity format.")

        id = product.get("id")
        if not isinstance(id, str):
            raise DomainException("Invalid product ID format.")

        name = product.get("name")
        if not isinstance(name, str):
            raise DomainException("Invalid product name format.")

        category = product.get("category")
        if not isinstance(category, str):
            raise DomainException("Invalid product category format.")

        origin_country = origin.get("country")
        if not isinstance(origin_country, str):
            raise DomainException("Invalid product origin country format.")

        origin_state = origin.get("state")
        if origin_state is not None and not isinstance(origin_state, str):
            raise DomainException("Invalid product origin state format.")

        origin_city = origin.get("city")
        if origin_city is not None and not isinstance(origin_city, str):
            raise DomainException("Invalid product origin city format.")

        origin_latitude = coordinates.get("latitude")
        if not isinstance(origin_latitude, (float, int)):
            raise DomainException("Invalid product origin coordinates latitude format.")

        origin_longitude = coordinates.get("longitude")
        if not isinstance(origin_longitude, (float, int)):
            raise DomainException("Invalid product origin coordinates longitude format.")

        quantity_value = quantity.get("value")
        if not isinstance(quantity_value, (float, int)):
            raise DomainException("Invalid product quantity value format.")

        quantity_unit = quantity.get("unit")
        if not isinstance(quantity_unit, str):
            raise DomainException("Invalid product quantity unit format.")

        lot_number = product.get("lot_number")
        if lot_number is not None and not isinstance(lot_number, str):
            raise DomainException("Invalid product lot number format.")

        return CanonicalProduct(
            id=id,
            name=name,
            category=category,
            quantity_value=float(quantity_value),
            quantity_unit=quantity_unit,
            origin_country=origin_country,
            origin_state=origin_state,
            origin_city=origin_city,
            origin_latitude=float(origin_latitude),
            origin_longitude=float(origin_longitude),
            lot_number=lot_number,
        )

    async def product_exists(self, product_id: UUID) -> bool:
        try:
            await self._find_product_by_id_handler.handle(product_id)
            return True
        except DomainException as domain_exception:
            if domain_exception.code == 404:
                return False
            raise domain_exception
