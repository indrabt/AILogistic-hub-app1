#!/bin/bash

# Install Chrome in Replit environment
echo "Installing Chrome dependencies..."
apt-get update
apt-get install -y wget gnupg2 apt-utils

# Add Google Chrome repository
echo "Adding Google Chrome repository..."
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Chrome
echo "Installing Google Chrome..."
apt-get update
apt-get install -y google-chrome-stable

# Check Chrome installation
echo "Checking Chrome installation..."
google-chrome --version

echo "Chrome installation completed"