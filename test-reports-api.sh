#!/bin/bash
# Reports Feature Test Script
# Run this from the project root to test the Reports API endpoints

echo "=========================================="
echo "Testing Bachat Buddy Reports API"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1. Checking if backend is running..."
if curl -s http://localhost:5001/api > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is NOT running${NC}"
    echo "   Run: cd backend && npm start"
    exit 1
fi

echo ""
echo "2. Getting sample token..."
# Note: This is a placeholder - you'd need actual login flow
# For testing, manually get token from localStorage in browser after logging in
echo -e "${YELLOW}! Manual step: Paste your auth token below${NC}"
echo "   (Open browser DevTools > Console > localStorage.getItem('token'))"
read -p "Enter your auth token: " TOKEN

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ No token provided${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Token received${NC}"

echo ""
echo "3. Testing Spending Analysis Report..."
RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5001/api/reports/spending-analysis?startDate=2025-11-01&endDate=2025-11-30")

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Spending Analysis endpoint working${NC}"
    echo "   Response: $RESPONSE" | head -c 100
    echo "..."
else
    echo -e "${RED}✗ Spending Analysis endpoint failed${NC}"
    echo "   Response: $RESPONSE"
fi

echo ""
echo "4. Testing Income Report..."
RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5001/api/reports/income?startDate=2025-11-01&endDate=2025-11-30")

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Income Report endpoint working${NC}"
    echo "   Response: $RESPONSE" | head -c 100
    echo "..."
else
    echo -e "${RED}✗ Income Report endpoint failed${NC}"
    echo "   Response: $RESPONSE"
fi

echo ""
echo "5. Testing Budget Report..."
RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5001/api/reports/budget?startDate=2025-11-01&endDate=2025-11-30")

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Budget Report endpoint working${NC}"
    echo "   Response: $RESPONSE" | head -c 100
    echo "..."
else
    echo -e "${RED}✗ Budget Report endpoint failed${NC}"
    echo "   Response: $RESPONSE"
fi

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
