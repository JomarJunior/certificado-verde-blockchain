from boto3 import Session as Boto3Session
from botocore.client import BaseClient as Boto3Client
from botocore.client import Config as Boto3Config
from miraveja_auth import (
    IOAuth2Provider,
    IOIDCDiscoveryService,
    OAuth2Configuration,
    OAuth2Provider,
    OIDCDiscoveryService,
)
from miraveja_auth.domain import IClaimsParser
from miraveja_auth.infrastructure.providers import KeycloakClaimsParser
from miraveja_di import DIContainer
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine as DatabaseEngine
from sqlalchemy.orm import Session as DatabaseSession
from sqlalchemy.orm import sessionmaker
from web3 import Web3

from miraveja_log import IAsyncLogger, ILogger, LoggerConfig, LoggerFactory
from miraveja_log.infrastructure import AsyncPythonLoggerAdapter, PythonLoggerAdapter

from .configuration import AppConfig, BlockchainConfig, DatabaseConfig, QRCodeConfig, StorageConfig


class AppDependencies:
    @staticmethod
    def register_dependencies(container: DIContainer) -> None:
        container.register_singletons(
            {
                AppConfig: lambda container: AppConfig.from_env(),
                # Logger
                LoggerConfig: lambda container: LoggerConfig.from_env(),
                LoggerFactory: lambda container: LoggerFactory(
                    logger_implementation=PythonLoggerAdapter,
                    async_logger_implementation=AsyncPythonLoggerAdapter,
                ),
                ILogger: lambda container: container.resolve(LoggerFactory).get_or_create_logger(
                    container.resolve(LoggerConfig)
                ),
                IAsyncLogger: lambda container: container.resolve(LoggerFactory).get_or_create_async_logger(
                    container.resolve(LoggerConfig)
                ),
                # OAuth2 Configuration
                OAuth2Configuration: lambda container: OAuth2Configuration.from_env(),
                IOIDCDiscoveryService: lambda container: container.resolve(OIDCDiscoveryService),
                IClaimsParser: lambda container: container.resolve(KeycloakClaimsParser),
                IOAuth2Provider: lambda container: container.resolve(OAuth2Provider),
                # Database
                DatabaseConfig: lambda container: DatabaseConfig.from_env(),
                DatabaseEngine: lambda container: create_engine(container.resolve(DatabaseConfig).database_url),
                # Blockchain
                BlockchainConfig: lambda container: BlockchainConfig.from_env(),
                Web3: lambda container: Web3(Web3.HTTPProvider(container.resolve(BlockchainConfig).provider_url)),
                # Storage
                StorageConfig: lambda container: StorageConfig.from_env(),
                Boto3Client: lambda container: Boto3Session().client(
                    "s3",
                    endpoint_url=container.resolve(StorageConfig).endpoint_url,
                    aws_access_key_id=container.resolve(StorageConfig).access_key,
                    aws_secret_access_key=container.resolve(StorageConfig).secret_key,
                    region_name=container.resolve(StorageConfig).region_name,
                    config=Boto3Config(
                        signature_version="s3v4",
                        s3={"addressing_style": "path"},
                    ),
                ),
                # QrCode
                QRCodeConfig: lambda container: QRCodeConfig.from_env(),
            },
        )

        container.register_scoped(
            {
                # Database Session
                DatabaseSession: lambda container: sessionmaker(
                    bind=container.resolve(DatabaseEngine),
                    autoflush=False,
                    autocommit=False,
                )(),
            }
        )
