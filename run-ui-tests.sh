#!/bin/bash

# Run UI tests for cycle count functionality

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null; then
    echo "Chrome is not installed. Installing Chrome..."
    chmod +x install-chrome.sh
    sudo ./install-chrome.sh
fi

# Display Chrome version
echo "Chrome version:"
google-chrome --version

# Run the headless test first (for debugging)
echo "Running headless UI test..."
node test-cycle-count-headless.js

# Run the UI test
echo "Running UI test with visible browser..."
node test-cycle-count-ui.js