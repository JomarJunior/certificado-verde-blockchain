from typing import Annotated

from pydantic import Field

from .base import BaseConfig


class StorageConfig(BaseConfig):
    endpoint_url: Annotated[str, Field(description="The endpoint URL for the storage service")]
    access_key: Annotated[str, Field(description="The access key for the storage service")]
    secret_key: Annotated[str, Field(description="The secret key for the storage service")]
    bucket_name: Annotated[str, Field(description="The bucket name for storing files")]
    region_name: Annotated[str, Field(description="The region name for the storage service")] = Field(
        "us-east-1",
        description="The region name for the storage service",
    )
