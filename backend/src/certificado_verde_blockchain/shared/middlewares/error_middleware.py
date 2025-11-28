import json
import traceback
import uuid

from fastapi import Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from miraveja_log import IAsyncLogger

from ..errors import DomainException


class ErrorMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, logger: IAsyncLogger) -> None:
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request, call_next):
        try:
            response = await call_next(request)
            return response
        except (Exception, DomainException) as exception:
            error_code = self.generate_error_code()
            await self.log_traceback(error_code)

            if isinstance(exception, DomainException):
                # Handle domain-specific exceptions
                return Response(
                    status_code=exception.code,
                    content=json.dumps({"error": exception.message, "code": error_code}),
                    media_type="application/json",
                )

            # Handle generic exceptions
            return Response(
                status_code=500,
                content=json.dumps({"error": "Internal Server Error", "code": error_code}),
                # Do not expose internal error details in production
                media_type="application/json",
            )

    def generate_error_code(self) -> str:
        return str(uuid.uuid4())

    async def log_traceback(self, error_code: str) -> None:
        if self.logger is None:
            return

        await self.logger.error(f"#{error_code} - An error occurred while processing the request.")
        traceback_str = traceback.format_exc()
        for line in traceback_str.strip().split("\n"):
            await self.logger.error(f"{line}")
