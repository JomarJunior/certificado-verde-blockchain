from typing import Annotated

from pydantic import Field

from .base import BaseConfig


class BlockchainConfig(BaseConfig):
    contract: Annotated[str, Field(description="The blockchain contract address")]
    abi_path: Annotated[str, Field(description="The file path to the contract ABI")]
    provider_url: Annotated[str, Field(description="The URL of the blockchain provider")]
    private_key: Annotated[str, Field(description="The private key for blockchain transactions")]
    admin_address: Annotated[str, Field(description="The admin address for blockchain transactions")]
