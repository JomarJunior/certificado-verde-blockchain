from typing import Annotated, Any, Dict
from uuid import uuid4

from pydantic import BaseModel, Field

from miraveja_log import IAsyncLogger

from ...shared.models import Document
from ..domain import Auditor, IAuditorRepository


class RegisterAuditorCommand(BaseModel):
    name: Annotated[str, Field(description="Name of the auditor.", min_length=1, max_length=255)]
    document: Annotated[Document, Field(description="Document information of the auditor.")]


class RegisterAuditorHandler:
    def __init__(self, repository: IAuditorRepository, logger: IAsyncLogger):
        self._repository = repository
        self._logger = logger

    async def handle(self, command: RegisterAuditorCommand) -> Dict[str, Any]:
        await self._logger.info(f"Registering new auditor: {command.name}")

        auditor = Auditor(
            id=uuid4(),
            name=command.name,
            document=command.document,
        )

        self._repository.save(auditor)

        await self._logger.info(f"Auditor registered with ID: {auditor.id}")

        return {"auditor": auditor.model_dump()}
