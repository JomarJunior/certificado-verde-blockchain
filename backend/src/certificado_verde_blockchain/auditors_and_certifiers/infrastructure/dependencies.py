from miraveja_di import DIContainer

from ..domain import IAuditorRepository, ICertifierRepository
from .sql import SqlAuditorRepository, SqlCertifierRepository


class AuditorsAndCertifiersDependencies:
    @staticmethod
    def register_dependencies(container: DIContainer) -> None:
        """Register auditors and certifiers related dependencies in the DI container.

        Args:
            container (DIContainer): The dependency injection container.
        """
        container.register_transients(
            {
                IAuditorRepository: lambda container: container.resolve(SqlAuditorRepository),
                ICertifierRepository: lambda container: container.resolve(SqlCertifierRepository),
            }
        )
