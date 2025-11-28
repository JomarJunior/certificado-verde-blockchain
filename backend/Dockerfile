# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies and Poetry
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && pip install --no-cache-dir poetry \
    && rm -rf /var/lib/apt/lists/*

# Configure Poetry to not use virtualenvs in Docker
RUN poetry config virtualenvs.create false

# Copy Poetry configuration files
COPY ./pyproject.toml ./poetry.lock ./README.md ./

# Install api dependencies
RUN poetry install --only main --no-root

# Copy application source code
COPY ./src ./src

# Install the api package itself
RUN poetry install --only-root

# Expose FastAPI port
EXPOSE 8000

# Start the API
CMD ["python", "-m", "certificado_verde_blockchain.main"]
