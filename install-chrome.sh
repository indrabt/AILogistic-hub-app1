#!/bin/bash

# Install Chrome script optimized for Replit environment
# Based on: https://gist.github.com/chaseconey/e8b4a254b4ea6afd0439

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Installing Chrome for Selenium tests...${NC}"

# Check if Chrome is already installed
if command -v google-chrome &> /dev/null; then
    echo -e "${GREEN}Chrome is already installed.${NC}"
    # Print Chrome version
    google-chrome --version
    exit 0
fi

# We'll try to use the pre-installed Chromium in the Replit environment
if command -v chromium &> /dev/null; then
    echo -e "${GREEN}Chromium is already installed.${NC}"
    # Create a symbolic link so scripts can use google-chrome command
    echo -e "${YELLOW}Creating symbolic link from chromium to google-chrome...${NC}"
    ln -s $(which chromium) /usr/local/bin/google-chrome 2>/dev/null || \
    sudo ln -s $(which chromium) /usr/local/bin/google-chrome 2>/dev/null || \
    mkdir -p $HOME/bin && ln -s $(which chromium) $HOME/bin/google-chrome && \
    export PATH=$HOME/bin:$PATH && echo 'export PATH=$HOME/bin:$PATH' >> $HOME/.bashrc
    
    # Check if link was created successfully
    if command -v google-chrome &> /dev/null; then
        echo -e "${GREEN}Symbolic link created successfully.${NC}"
        google-chrome --version
        exit 0
    else
        echo -e "${YELLOW}Could not create symbolic link. Using chromium directly in tests...${NC}"
        # Create a configuration file for the tests to use chromium instead
        echo "CHROME_PATH=$(which chromium)" > .chrome_config
        exit 0
    fi
fi

echo -e "${RED}Chrome installation failed. Selenium tests requiring a browser may not work.${NC}"
echo -e "${YELLOW}You can still run the API tests and simple tests that don't require a browser.${NC}"
exit 1