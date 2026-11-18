# Multi-stage Dockerfile pour YaBiso Microservices
# Usage: docker build -t yabiso-{service} -f backend/Dockerfile --build-arg SERVICE_PORT=8001 .

FROM python:3.11-slim as builder

WORKDIR /tmp

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# Final stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY backend/shared ./shared
COPY backend/api-gateway ./api-gateway
COPY backend/auth-service ./auth-service
COPY backend/products-service ./products-service
COPY backend/payments-service ./payments-service
COPY backend/analytics-service ./analytics-service
COPY .env .env

# Build arguments
ARG SERVICE_NAME=api-gateway
ARG SERVICE_PORT=8000

# Environment variables
ENV SERVICE_NAME=${SERVICE_NAME}
ENV SERVICE_PORT=${SERVICE_PORT}
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${SERVICE_PORT}/health || exit 1

# Run application
CMD ["sh", "-c", "cd ${SERVICE_NAME} && python main.py"]
