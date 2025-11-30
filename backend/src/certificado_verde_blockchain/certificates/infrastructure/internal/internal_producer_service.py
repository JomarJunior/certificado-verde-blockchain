from typing import Optional
from uuid import UUID

from ....producers import FindProducerByIdHandler
from ....shared.errors import DomainException
from ...domain import CanonicalProducer, IProducerService


class InternalProducerService(IProducerService):
    def __init__(self, find_producer_by_id_handler: FindProducerByIdHandler):
        self._find_producer_by_id_handler = find_producer_by_id_handler

    async def find_canonical_by_id(self, producer_id: UUID) -> Optional[CanonicalProducer]:
        producer = await self._find_producer_by_id_handler.handle(producer_id)

        if not isinstance(producer, dict):
            raise DomainException("Invalid producer data format.")

        if (
            "id" not in producer
            or "name" not in producer
            or "document" not in producer
            or "address" not in producer
            or "car_code" not in producer
        ):
            raise DomainException("Missing required producer fields.")

        document = producer.get("document")
        if not isinstance(document, dict):
            raise DomainException("Invalid producer document format.")

        address = producer.get("address")
        if not isinstance(address, dict):
            raise DomainException("Invalid producer address format.")

        if "document_type" not in document or "number" not in document:
            raise DomainException("Missing required producer document fields.")

        if "country" not in address or "state" not in address or "city" not in address or "coordinates" not in address:
            raise DomainException("Missing required producer address fields.")

        coordinates = address.get("coordinates")
        if not isinstance(coordinates, dict):
            raise DomainException("Invalid producer address coordinates format.")

        if "latitude" not in coordinates or "longitude" not in coordinates:
            raise DomainException("Missing required producer address coordinates fields.")

        id = producer.get("id")
        if not isinstance(id, str):
            raise DomainException("Invalid producer ID format.")

        name = producer.get("name")
        if not isinstance(name, str):
            raise DomainException("Invalid producer name format.")

        document_type = document.get("document_type")
        if not isinstance(document_type, str):
            raise DomainException("Invalid producer document type format.")

        document_number = document.get("number")
        if not isinstance(document_number, str):
            raise DomainException("Invalid producer document number format.")

        car_code = producer.get("car_code")
        if not isinstance(car_code, str):
            raise DomainException("Invalid producer car code format.")

        address_country = address.get("country")
        if not isinstance(address_country, str):
            raise DomainException("Invalid producer address country format.")

        address_state = address.get("state")
        if not isinstance(address_state, str):
            raise DomainException("Invalid producer address state format.")

        address_city = address.get("city")
        if not isinstance(address_city, str):
            raise DomainException("Invalid producer address city format.")

        address_latitude = coordinates.get("latitude")
        if not isinstance(address_latitude, (float, int)):
            raise DomainException("Invalid producer address coordinates latitude format.")

        address_longitude = coordinates.get("longitude")
        if not isinstance(address_longitude, (float, int)):
            raise DomainException("Invalid producer address coordinates longitude format.")

        return CanonicalProducer(
            id=id,
            name=name,
            document_type=document_type,
            document_number=document_number,
            car_code=car_code,
            address_country=address_country,
            address_state=address_state,
            address_city=address_city,
            address_latitude=float(address_latitude),
            address_longitude=float(address_longitude),
        )

    async def producer_exists(self, producer_id: UUID) -> bool:
        try:
            await self._find_producer_by_id_handler.handle(producer_id)
            return True
        except DomainException as domain_exception:
            if domain_exception.code == 404:
                return False
            raise domain_exception
