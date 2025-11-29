from typing import Annotated, ClassVar, Optional

from pydantic import BaseModel, ConfigDict, Field

from .coordinates import Coordinates


class Location(BaseModel):
    """Value object that represents a geographical location.

    Attributes:
        country (str): The country of the location.
        state (Optional[str]): The state of the location.
        city (Optional[str]): The city of the location.
        coordinates (Coordinates): The geographical coordinates of the location.
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True)

    country: Annotated[str, Field(description="The country of the location.", min_length=1, max_length=100)]
    state: Annotated[Optional[str], Field(description="The state of the location.", max_length=100)]
    city: Annotated[Optional[str], Field(description="The city of the location.", max_length=100)]
    coordinates: Annotated[Coordinates, Field(description="The geographical coordinates of the location.")]
