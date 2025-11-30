from miraveja_di import DIContainer

from ..domain import (
    IBlockchainService,
    ICertificateRepository,
    ICertifierService,
    IFileService,
    IProducerService,
    IProductService,
    IQRCodeService,
    ISerialCodeService,
    IStorageService,
)
from .internal import InternalCertifierService, InternalProducerService, InternalProductService
from .minio import MinioStorageService
from .pillow import PillowFileService, QRCodeService
from .serial_code_service import SerialCodeService
from .sql import SqlCertificateRepository
from .web3_blockchain_service import Web3BlockchainService


class CertificatesDependencies:
    @staticmethod
    def register_dependencies(container: DIContainer) -> None:
        """Register certificate-related dependencies in the DI container.

        Args:
            container (DIContainer): The dependency injection container.
        """
        container.register_transients(
            {
                IBlockchainService: lambda container: container.resolve(Web3BlockchainService),
                ICertificateRepository: lambda container: container.resolve(SqlCertificateRepository),
                ICertifierService: lambda container: container.resolve(InternalCertifierService),
                IProducerService: lambda container: container.resolve(InternalProducerService),
                IProductService: lambda container: container.resolve(InternalProductService),
                IStorageService: lambda container: container.resolve(MinioStorageService),
                IFileService: lambda container: container.resolve(PillowFileService),
                IQRCodeService: lambda container: container.resolve(QRCodeService),
                ISerialCodeService: lambda container: container.resolve(SerialCodeService),
            }
        )
