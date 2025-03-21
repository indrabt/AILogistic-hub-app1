#!/bin/bash

# Run Playwright tests with colored output
# Usage: 
#   ./run-tests.sh                     # Run all tests
#   ./run-tests.sh warehouse           # Run tests containing "warehouse" in the filename
#   ./run-tests.sh -h                  # Show help
#   ./run-tests.sh --headless false    # Run tests in headed mode (show browser)
#   ./run-tests.sh --debug             # Run tests with debug mode enabled

# Make script executable if it's not already
chmod +x run-tests.sh

# Create the test data directory if it doesn't exist
mkdir -p tests/test-data

# Define colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
HEADLESS="true"
DEBUG="false"
PATTERN=""

# Print help
function show_help {
  echo -e "${CYAN}Warehouse Testing Script${NC}"
  echo -e "${YELLOW}===========================================================${NC}"
  echo -e "Usage:"
  echo -e "  ${GREEN}./run-tests.sh${NC}                     # Run all tests"
  echo -e "  ${GREEN}./run-tests.sh warehouse${NC}           # Run tests containing \"warehouse\" in the filename"
  echo -e "  ${GREEN}./run-tests.sh -h${NC}                  # Show this help"
  echo -e "  ${GREEN}./run-tests.sh --headless false${NC}    # Run tests in headed mode (show browser)"
  echo -e "  ${GREEN}./run-tests.sh --debug${NC}             # Run tests with debug mode enabled"
  echo -e "${YELLOW}===========================================================${NC}"
  exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_help
      ;;
    --headless)
      HEADLESS="$2"
      shift
      shift
      ;;
    --debug)
      DEBUG="true"
      shift
      ;;
    *)
      PATTERN="$1"
      shift
      ;;
  esac
done

# Print header
echo -e "${BLUE}Running Playwright tests...${NC}"
echo -e "${YELLOW}===========================================================${NC}"
echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Headless: ${HEADLESS}"
echo -e "  Debug: ${DEBUG}"
if [ -n "$PATTERN" ]; then
  echo -e "  Pattern: ${PATTERN}"
fi
echo -e "${YELLOW}===========================================================${NC}"

# Build the command
CMD="npx playwright test"

if [ -n "$PATTERN" ]; then
  CMD="${CMD} ${PATTERN}"
fi

if [ "$HEADLESS" = "false" ]; then
  CMD="${CMD} --headed"
fi

if [ "$DEBUG" = "true" ]; then
  CMD="${CMD} --debug"
fi

# Execute the command
echo -e "${BLUE}Executing: ${CMD}${NC}"
eval $CMD

# Check the exit status
if [ $? -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
else
  echo -e "${RED}Some tests failed. Check the output above for details.${NC}"
fi

echo -e "${YELLOW}===========================================================${NC}"
echo -e "${BLUE}Test run complete.${NC}"