#!/bin/bash

# Test runner script for cycle count functionality tests

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "\n${BLUE}==== CYCLE COUNT TESTING SUITE ====${NC}\n"

# Check for Chrome installation
if ! command -v google-chrome &> /dev/null; then
    echo -e "${YELLOW}Chrome is not installed. Some tests may not work properly.${NC}"
    echo -e "Run ${GREEN}./install-chrome.sh${NC} to install Chrome first if you want to run Selenium tests."
fi

# Menu function
function show_menu() {
    echo -e "\n${BLUE}Choose a test to run:${NC}"
    echo -e "${GREEN}1)${NC} Run API test (no browser needed)"
    echo -e "${GREEN}2)${NC} Run Simple UI Test (no browser needed)"
    echo -e "${GREEN}3)${NC} Run Selenium Headless Test (requires Chrome)"
    echo -e "${GREEN}4)${NC} Run Selenium UI Test (requires Chrome, non-headless)"
    echo -e "${GREEN}5)${NC} Run Replit-optimized UI Test (requires Chrome)"
    echo -e "${GREEN}6)${NC} Run all tests"
    echo -e "${GREEN}0)${NC} Exit"
    
    echo -ne "\n${YELLOW}Select an option:${NC} "
    read -r option
    
    case $option in
        1) run_api_test ;;
        2) run_simple_ui_test ;;
        3) run_selenium_headless_test ;;
        4) run_selenium_ui_test ;;
        5) run_replit_test ;;
        6) run_all_tests ;;
        0) exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" && show_menu ;;
    esac
}

# Run API test
function run_api_test() {
    echo -e "\n${BLUE}Running API test...${NC}"
    node test-cycle-count-api.js
    
    echo -e "\n${GREEN}Test completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Run Simple UI Test
function run_simple_ui_test() {
    echo -e "\n${BLUE}Running Simple UI test...${NC}"
    node test-cycle-count-simple.js
    
    echo -e "\n${GREEN}Test completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Run Selenium Headless Test
function run_selenium_headless_test() {
    echo -e "\n${BLUE}Running Selenium Headless test...${NC}"
    node test-cycle-count-headless.js
    
    echo -e "\n${GREEN}Test completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Run Selenium UI Test
function run_selenium_ui_test() {
    echo -e "\n${BLUE}Running Selenium UI test (non-headless)...${NC}"
    node test-cycle-count-ui.js
    
    echo -e "\n${GREEN}Test completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Run Replit-optimized Test
function run_replit_test() {
    echo -e "\n${BLUE}Running Replit-optimized UI test...${NC}"
    node test-cycle-count-replit.js
    
    echo -e "\n${GREEN}Test completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Run all tests
function run_all_tests() {
    echo -e "\n${BLUE}Running all tests sequentially...${NC}"
    
    echo -e "\n${YELLOW}1. API Test${NC}"
    node test-cycle-count-api.js
    
    echo -e "\n${YELLOW}2. Simple UI Test${NC}"
    node test-cycle-count-simple.js
    
    echo -e "\n${YELLOW}3. Checking Chrome installation...${NC}"
    if command -v google-chrome &> /dev/null; then
        echo -e "${GREEN}Chrome is installed. Proceeding with Selenium tests.${NC}"
        
        echo -e "\n${YELLOW}4. Selenium Headless Test${NC}"
        node test-cycle-count-headless.js
        
        echo -e "\n${YELLOW}5. Replit-optimized UI Test${NC}"
        node test-cycle-count-replit.js
        
        echo -e "\n${YELLOW}6. Selenium UI Test (non-headless)${NC}"
        node test-cycle-count-ui.js
    else
        echo -e "${RED}Chrome is not installed. Skipping Selenium tests.${NC}"
    fi
    
    echo -e "\n${GREEN}All tests completed. Press Enter to return to menu...${NC}"
    read
    show_menu
}

# Show the menu
show_menu