#!/bin/bash

# Run Playwright tests with colored output
# Usage: ./run-tests.sh [test file pattern]

# Make script executable if it's not already
chmod +x run-tests.sh

# Create the test data directory if it doesn't exist
mkdir -p tests/test-data

# Define colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}Running Playwright tests...${NC}"
echo -e "${YELLOW}==========================================================${NC}"

if [ $# -eq 0 ]; then
  # If no arguments are provided, run all tests
  echo -e "${YELLOW}Running all tests${NC}"
  npx playwright test
else
  # If an argument is provided, use it as a pattern to filter tests
  echo -e "${YELLOW}Running tests matching pattern: $1${NC}"
  npx playwright test $1
fi

# Check the exit status
if [ $? -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
else
  echo -e "${RED}Some tests failed. Check the output above for details.${NC}"
fi

echo -e "${YELLOW}==========================================================${NC}"
echo -e "${BLUE}Test run complete.${NC}"