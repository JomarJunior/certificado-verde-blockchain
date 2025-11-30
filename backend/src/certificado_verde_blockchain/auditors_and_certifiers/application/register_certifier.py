from typing import Annotated, Any, Dict, List
from uuid import uuid4

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.models import Document
from ..domain import Auditor, Certifier, ICertifierRepository


class RegisterCertifierCommand(BaseModel):
    name: Annotated[str, Field(description="Name of the certifier.", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document information of the certifier.")]
    auditors: Annotated[List[Auditor], Field(description="List of auditors associated with the certifier.")]


class RegisterCertifierHandler:
    def __init__(self, repository: ICertifierRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, command: RegisterCertifierCommand) -> Dict[str, Any]:
        await self._logger.info(f"Registering new certifier: {command.name}")

        certifier = Certifier(
            id=uuid4(),
            name=command.name,
            document=command.document,
            auditors=command.auditors,
        )

        self._repository.save(certifier)

        await self._logger.info(f"Certifier registered with ID: {certifier.id}")

        return {"certifier": certifier.model_dump()}
