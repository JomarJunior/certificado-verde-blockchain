from enum import Enum


class MeasurementUnit(str, Enum):
    KG = "KG"
    LITERS = "LITERS"
    TONS = "TONS"
    UNITS = "UNITS"

    def __str__(self) -> str:
        return self.value
