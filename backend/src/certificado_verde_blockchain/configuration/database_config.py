from typing import Annotated

from pydantic import Field

from .base import BaseConfig


class DatabaseConfig(BaseConfig):
    """Configuration settings for the database connection."""

    db_type: Annotated[str, Field(description="Type of the database (e.g., postgresql, mysql)")] = "postgresql"
    host: Annotated[str, Field(description="Database host address")] = "localhost"
    port: Annotated[int, Field(description="Database port number", ge=1, le=65535)] = 5432
    username: Annotated[str, Field(description="Username for database authentication")] = "user"
    password: Annotated[str, Field(description="Password for database authentication")] = "password"
    name: Annotated[str, Field(description="Name of the database to connect to")] = "certificado_verde_db"
    max_connections: Annotated[int, Field(description="Maximum number of database connections", ge=1)] = 10

    @property
    def database_url(self) -> str:
        """Construct the database connection URL."""
        return f"{self.db_type}://{self.username}:{self.password}@" f"{self.host}:{self.port}/{self.name}"
