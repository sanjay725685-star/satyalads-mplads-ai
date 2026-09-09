FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend /app/backend

# Seed data on container initialization if not present
CMD ["sh", "-c", "python backend/seed_data.py && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
