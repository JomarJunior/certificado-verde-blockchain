from miraveja_di import DIContainer

from ..domain import IProductRepository
from .sql import SqlProductRepository


class ProductDependencies:
    @staticmethod
    def register_dependencies(container: DIContainer) -> None:
        """Register product-related dependencies in the DI container.

        Args:
            container (DIContainer): The dependency injection container.
        """
        container.register_transients(
            {
                IProductRepository: lambda container: container.resolve(SqlProductRepository),
            }
        )
