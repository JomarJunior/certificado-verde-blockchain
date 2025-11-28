import os
from typing import Any, Dict

from pydantic import BaseModel


class BaseConfig(BaseModel):
    @classmethod
    def from_env(cls):
        """Create an instance of the configuration class by reading values from environment variables.
        The environment variable names are constructed by combining the class name (in uppercase)
        without the 'CONFIG' suffix and the field names (also in uppercase).
        For example, for a class named 'DatabaseConfig' with a field 'host', the corresponding
        environment variable would be 'DATABASE_HOST'.

        Returns:
            An instance of the configuration class populated with values from environment variables.
        """
        env_prefix = cls.__name__.upper() + "_"
        if cls.__name__ == "AppConfig":
            env_prefix = ""  # No prefix for AppConfig
        if "CONFIG" in env_prefix:
            env_prefix = env_prefix.replace("CONFIG", "", 1)  # Remove 'CONFIG' suffix

        data_dict: Dict[str, Any] = {}
        # Iterate over the model fields and populate data_dict from environment variables
        for field in cls.model_fields:
            env_var = env_prefix + field.upper()
            if env_var in os.environ:
                data_dict[field] = os.environ[env_var]

        return cls.model_validate(data_dict)  # Validate and create an instance of the class
