from enum import Enum


class ProductCategory(str, Enum):
    FRUIT = "FRUIT"
    GRAIN = "GRAIN"
    RESOURCE = "RESOURCE"
    OIL = "OIL"

    def __str__(self) -> str:
        return self.value
