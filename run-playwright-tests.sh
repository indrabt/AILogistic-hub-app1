#!/bin/bash

# Set environment variables
export PLAYWRIGHT_BROWSERS_PATH=0
export CHROMIUM_PATH=$(which chromium-browser)

# Display chromium path
echo "Using Chromium at: $CHROMIUM_PATH"

# Create directories needed for browser cache
mkdir -p /tmp/.cache/ms-playwright

# Run the specified test or all tests
if [ -z "$1" ]; then
  # Run all tests
  npx playwright test 
else
  # Run specific test
  npx playwright test "$1" 
fi