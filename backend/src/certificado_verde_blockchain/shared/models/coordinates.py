from typing import Annotated, ClassVar

from pydantic import BaseModel, ConfigDict, Field


class Coordinates(BaseModel):
    """Value object that represents geographical coordinates with latitude and longitude.

    Attributes:
        latitude (float): The latitude of the location.
        longitude (float): The longitude of the location.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True)

    latitude: Annotated[float, Field(description="The latitude of the location.")]
    longitude: Annotated[float, Field(description="The longitude of the location.")]
