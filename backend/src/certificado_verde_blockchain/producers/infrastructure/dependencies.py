from miraveja_di import DIContainer

from ..domain import IProducerRepository
from .sql import SqlProducerRepository


class ProducerDependencies:
    @staticmethod
    def register_dependencies(container: DIContainer) -> None:
        """Register producer-related dependencies in the DI container.

        Args:
            container (DIContainer): The dependency injection container.
        """
        container.register_transients(
            {
                IProducerRepository: lambda container: container.resolve(SqlProducerRepository),
            }
        )
