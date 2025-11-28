from typing import Annotated

from pydantic import Field

from .base import BaseConfig


class AppConfig(BaseConfig):
    title: Annotated[str, Field(description="The name of the application")]
    description: Annotated[str, Field(description="A brief description of the application")]
    version: Annotated[str, Field(description="The version of the application")]
    root_path: Annotated[str, Field(description="The root path for the application")] = Field(
        "/certificado-verde-blockchain/api",
        description="The root path for the application",
    )
    debug_mode: Annotated[bool, Field(description="Flag to indicate if the app is running in debug mode")] = Field(
        False,
        description="Flag to indicate if the app is running in debug mode",
    )
    host: Annotated[str, Field(description="The host address where the app will run")] = Field(
        "0.0.0.0",
        description="The host address where the app will run",
    )
    port: Annotated[int, Field(description="The port number where the app will listen")] = Field(
        8000,
        description="The port number where the app will listen",
    )
