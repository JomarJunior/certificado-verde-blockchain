from typing import Literal, Union

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from miraveja_log import IAsyncLogger, ILogger


class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, logger: Union[ILogger, IAsyncLogger], type: Literal["sync", "async"]) -> None:
        super().__init__(app)
        self.logger = logger
        self.type = type

    @classmethod
    def create_sync(cls, app: ASGIApp, logger: ILogger) -> "LoggingMiddleware":
        return cls(app, logger, type="sync")

    @classmethod
    def create_async(cls, app: ASGIApp, logger: IAsyncLogger) -> "LoggingMiddleware":
        return cls(app, logger, type="async")

    async def dispatch(self, request, call_next):

        await self.add_log("=" * 42 + "Incoming Request" + "=" * 42)
        await self.add_log(f"[{request.method}] {request.url}")

        headers = "\n".join(f"{k}: {v}" for k, v in request.headers.items())
        await self.add_log("Headers:")
        await self.add_log("")
        for line in headers.splitlines():
            # Mask Authorization header
            if line.lower().startswith("authorization:"):
                await self.add_log("authorization: ****")
            else:
                await self.add_log(f"{line}")
        await self.add_log("")

        body = await request.body()
        if body:
            await self.add_log("Body:")
            await self.add_log("")
            for line in body.decode().splitlines():
                if len(line) >= 150:
                    line = f"{line[:150]}... [truncated, original length: {len(line)}]"
                if "password" in line.lower():
                    await self.add_log("****")
                elif "token" in line.lower():
                    await self.add_log("****")
                else:
                    await self.add_log(f"{line}")

        await self.add_log("-" * 41 + "Processing Request" + "-" * 41)
        response = await call_next(request)
        await self.add_log("-" * 40 + "Finished Processing" + "-" * 41)

        await self.add_log(f"Response status: {response.status_code}")
        await self.add_log("=" * 41 + "Outgoing Response" + "=" * 42)

        return response

    async def add_log(self, message: str) -> None:
        if self.type == "async":
            await self.logger.info(message)  # type: ignore
        else:
            self.logger.info(message)
