#!/bin/bash

# Initialize Test Environment
# This script sets up the necessary directories and files for testing

# Define colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Initializing test environment...${NC}"

# Make sure the script is executable
chmod +x tests/init-test-env.sh

# Create test data directory
echo -e "${YELLOW}Creating test data directories...${NC}"
mkdir -p tests/test-data
mkdir -p tests/screenshots

# Check if Playwright is installed
if ! command -v npx playwright --version &> /dev/null; then
  echo -e "${YELLOW}Installing Playwright dependencies...${NC}"
  npx playwright install --with-deps
fi

# Create basic README for tests
if [ ! -f tests/README.md ]; then
  echo -e "${YELLOW}Creating test documentation...${NC}"
  cat > tests/README.md << 'EOL'
# Warehouse Management System Tests

This directory contains end-to-end tests for the Warehouse Management System using Playwright.

## Test Structure

- **warehouse-picking.spec.ts**: Tests the picking functionality
- **warehouse-packing.spec.ts**: Tests the packing functionality
- **navigation.spec.ts**: Tests navigation across different warehouse functions
- **helpers/**: Helper functions for test state management

## Running Tests

Run all tests:
```bash
./run-tests.sh
```

Run specific tests:
```bash
./run-tests.sh warehouse-picking
```

Run tests with UI:
```bash
./run-tests.sh --headless false
```

Run tests in debug mode:
```bash
./run-tests.sh --debug
```

## Test Data

Test data is stored in `tests/test-data/` and can be used across test runs.
EOL
  echo -e "${GREEN}Created test documentation at tests/README.md${NC}"
fi

# Initialize the test data with placeholders if needed
if [ ! -f tests/test-data/.gitkeep ]; then
  touch tests/test-data/.gitkeep
  echo -e "${YELLOW}Created placeholder for test data directory${NC}"
fi

echo -e "${GREEN}Test environment initialized successfully!${NC}"
echo -e "${CYAN}You can now run tests with: ./run-tests.sh${NC}"