from typing import Annotated, ClassVar

from pydantic import BaseModel, ConfigDict, Field

from .measurement_unit import MeasurementUnit


class Quantity(BaseModel):
    """Represents a quantity with its value and measurement unit.

    Attributes:
        value (float): The quantity amount related to the product.
        unit (MeasurementUnit): The measurement unit of the quantity.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True, use_enum_values=True)

    value: Annotated[float, Field(gt=0, description="The quantity amount related to the product.")]
    unit: Annotated[MeasurementUnit, Field(description="The measurement unit of the quantity.")]
