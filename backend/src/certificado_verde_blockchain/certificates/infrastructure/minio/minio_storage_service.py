import asyncio

from botocore.client import BaseClient as Boto3Client

from ....configuration import StorageConfig
from ...domain import IStorageService


class MinioStorageService(IStorageService):
    def __init__(
        self,
        config: StorageConfig,
        minio_client: Boto3Client,
    ) -> None:
        self._config = config
        self._minio_client = minio_client

    async def _ensure_bucket_exists(self) -> None:
        # Check if the bucket exists; if not, create it
        existing_buckets = self._minio_client.list_buckets().get("Buckets", [])
        bucket_names = [bucket["Name"] for bucket in existing_buckets]

        if self._config.bucket_name not in bucket_names:
            self._minio_client.create_bucket(Bucket=self._config.bucket_name, ACL="public-read")

    async def upload_qr_code(self, file_name: str, data: bytes, content_type: str) -> str:
        await self._ensure_bucket_exists()

        # Find file extension from content type
        extension = content_type.split("/")[-1]
        if not file_name.endswith(f".{extension}"):
            file_name = f"{file_name}.{extension}"

        # Use asyncio to run the blocking I/O operation in a separate thread
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self._minio_client.put_object(
                Bucket=self._config.bucket_name,
                Key=file_name,
                Body=data,
                ContentType=content_type,
            ),
        )

        return file_name

    async def get_qr_code_from_key(self, key: str) -> bytes:
        # Use asyncio to run the blocking I/O operation in a separate thread
        loop = asyncio.get_event_loop()

        def get_object_data() -> bytes:
            response = self._minio_client.get_object(Bucket=self._config.bucket_name, Key=key)
            return response["Body"].read()

        data = await loop.run_in_executor(None, get_object_data)
        return data
