#!/bin/bash

# SparksStream Build Script
# This script builds the frontend and prepares the application for production

echo "🚀 Starting SparksStream Build Process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if Node.js is installed
echo -e "${BLUE}Step 1: Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"
echo ""

# Step 2: Install frontend dependencies
echo -e "${BLUE}Step 2: Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
cd ..
echo ""

# Step 3: Install backend dependencies
echo -e "${BLUE}Step 3: Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi
cd ..
echo ""

# Step 4: Build frontend
echo -e "${BLUE}Step 4: Building frontend for production...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend build completed successfully${NC}"
cd ..
echo ""

# Step 5: Check if dist folder exists
echo -e "${BLUE}Step 5: Verifying build output...${NC}"
if [ -d "frontend/dist" ]; then
    echo -e "${GREEN}✓ Build output found at frontend/dist/${NC}"
    echo -e "${GREEN}✓ Build size: $(du -sh frontend/dist | cut -f1)${NC}"
else
    echo -e "${RED}❌ Build output not found${NC}"
    exit 1
fi
echo ""

# Step 6: Check environment files
echo -e "${BLUE}Step 6: Checking environment configuration...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env file found${NC}"
else
    echo -e "${RED}⚠ Warning: backend/.env file not found${NC}"
    echo -e "${RED}  Please create backend/.env with required variables${NC}"
fi
echo ""

# Step 7: Create uploads directory if it doesn't exist
echo -e "${BLUE}Step 7: Setting up uploads directory...${NC}"
mkdir -p backend/uploads
echo -e "${GREEN}✓ Uploads directory ready${NC}"
echo ""

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure backend/.env with your environment variables"
echo "2. Start the server: cd backend && npm start"
echo "3. Access the application at: http://localhost:5000"
echo ""
echo -e "${BLUE}For production deployment, see DEPLOYMENT_GUIDE.md${NC}"
echo ""
