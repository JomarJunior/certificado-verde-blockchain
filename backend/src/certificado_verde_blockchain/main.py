from typing import Union

import dotenv
import uvicorn
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from miraveja_auth import FastAPIAuthenticator
from miraveja_di import DIContainer
from miraveja_di.infrastructure.fastapi_integration import ScopedContainerMiddleware

from miraveja_log import IAsyncLogger, ILogger

from .auditors_and_certifiers.infrastructure import AuditorsAndCertifiersDependencies
from .auditors_and_certifiers.infrastructure.http import AuditorsAndCertifiersRoutes
from .configuration import AppConfig
from .dependencies import AppDependencies
from .producers.infrastructure import ProducerDependencies
from .producers.infrastructure.http import ProducerRoutes
from .products.infrastructure import ProductDependencies
from .products.infrastructure.http import ProductRoutes
from .shared.errors import DomainException
from .shared.middlewares import ErrorMiddleware, LoggingMiddleware

# Load environment variables from a .env file
dotenv.load_dotenv("./.env")

# Create DI container
container: DIContainer = DIContainer()

# Register dependencies
AppDependencies.register_dependencies(container)
ProductDependencies.register_dependencies(container)
ProducerDependencies.register_dependencies(container)
AuditorsAndCertifiersDependencies.register_dependencies(container)

logger: Union[ILogger, IAsyncLogger] = container.resolve(IAsyncLogger)

# Initialize FastAPI app
app_config: AppConfig = container.resolve(AppConfig)
app = FastAPI(
    title=app_config.title,
    description=app_config.description,
    version=app_config.version,
    debug=app_config.debug_mode,
    redirect_slashes=False,
    root_path=app_config.root_path,
)

# Middlewares
app.add_middleware(
    ErrorMiddleware,
    logger=logger,
)

app.add_middleware(
    LoggingMiddleware.create_async,
    logger=logger,
)

app.add_middleware(
    ScopedContainerMiddleware,  # type: ignore
    container=container,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Important: Handle preflight requests properly
    expose_headers=["Content-Type", "X-Content-Type-Options"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Setup routers for API versioning
api_version1_router: APIRouter = APIRouter(prefix="/v1")

# OAuth2/OIDC authenticator
fastapi_authenticator: FastAPIAuthenticator = container.resolve(FastAPIAuthenticator)

# Define API endpoints
ProductRoutes.register_routes(api_version1_router, container)
ProducerRoutes.register_routes(api_version1_router, container)
AuditorsAndCertifiersRoutes.register_routes(api_version1_router, container)


# Health check endpoint
@api_version1_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Error raising endpoint for testing
@api_version1_router.get("/error")
async def raise_error():
    raise DomainException("This is a test exception for the error middleware.")


# Catch-all route for undefined paths
@api_version1_router.get("/{full_path:path}")
async def catch_all(full_path: str):
    return {"message": f"The path '/{full_path}' does not exist."}


# Include the API router in the main app
app.include_router(api_version1_router)

if __name__ == "__main__":
    uvicorn.run(
        "certificado_verde_blockchain.main:app",
        host=app_config.host,
        port=app_config.port,
        reload=True,
        reload_dirs=["/app"],
    )
