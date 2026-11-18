#!/bin/bash
# YaBiso Backend - Quick Start Script

set -e

echo "🚀 YaBiso Backend Phase 1 - Quick Start"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Docker
echo -e "${BLUE}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found${NC}"

# Create .env if not exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Created .env from template - update with your values${NC}"
    fi
fi

# Start containers
echo ""
echo -e "${BLUE}Starting containers...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Wait for services
echo -e "${BLUE}Waiting 15 seconds for services to initialize...${NC}"
sleep 15

# Run health check
if [ -f scripts/health-check.py ]; then
    echo ""
    echo -e "${BLUE}Running health check...${NC}"
    python scripts/health-check.py
fi

# Run tests
if [ -f test-services.py ]; then
    echo ""
    echo -e "${BLUE}Running service tests...${NC}"
    python test-services.py
fi

echo ""
echo -e "${GREEN}✅ YaBiso Backend is ready!${NC}"
echo ""
echo "📋 Service URLs:"
echo "   API Gateway:      http://localhost:8000"
echo "   Auth Service:     http://localhost:8001"
echo "   Products Service: http://localhost:8002"
echo "   Payments Service: http://localhost:8003"
echo "   Analytics Service: http://localhost:8004"
echo ""
echo -e "📊 View logs:   ${YELLOW}docker-compose -f docker-compose.dev.yml logs -f${NC}"
echo -e "🛑 Stop services: ${YELLOW}docker-compose -f docker-compose.dev.yml down${NC}"
