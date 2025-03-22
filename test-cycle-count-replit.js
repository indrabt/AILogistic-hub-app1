/**
 * Selenium UI Test for Cycle Count Functionality (Replit Version)
 * 
 * Simplified version for Replit environment testing cycle count functionality.
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:5000',
  waitTimeout: 10000,
  username: 'wstaff',
  password: 'password',
  screenshotDir: './test-screenshots'
};

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(config.screenshotDir)) {
  fs.mkdirSync(config.screenshotDir, { recursive: true });
}

// Utility function for logging
function log(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${timestamp}] ${message}`);
}

// Setup WebDriver
async function setup() {
  log('Setting up WebDriver...');
  
  let options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  // Check if we have a custom Chrome path from the installation script
  if (fs.existsSync('.chrome_config')) {
    const chromeConfig = fs.readFileSync('.chrome_config', 'utf8');
    const chromePath = chromeConfig.split('=')[1].trim();
    log(`Using custom Chrome path: ${chromePath}`);
    options.setChromeBinaryPath(chromePath);
  }
  
  try {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    log('WebDriver setup complete');
    return driver;
  } catch (error) {
    log(`Error setting up WebDriver: ${error.message}`);
    throw error;
  }
}

// Teardown WebDriver
async function teardown(driver) {
  if (driver) {
    log('Tearing down WebDriver...');
    try {
      await driver.quit();
      log('WebDriver teardown complete');
    } catch (error) {
      log(`Error during teardown: ${error.message}`);
    }
  }
}

// Take screenshot for debugging
async function takeScreenshot(driver, name) {
  try {
    const screenshot = await driver.takeScreenshot();
    const filename = path.join(config.screenshotDir, `${name}_${Date.now()}.png`);
    fs.writeFileSync(filename, screenshot, 'base64');
    log(`Screenshot saved: ${filename}`);
  } catch (error) {
    log(`Error taking screenshot: ${error.message}`);
  }
}

// Login to the application
async function login(driver) {
  try {
    log('Navigating to login page...');
    await driver.get(`${config.baseUrl}/login`);
    
    // Wait for the page to load
    await driver.wait(until.elementLocated(By.name('username')), config.waitTimeout);
    
    log('Entering login credentials...');
    await driver.findElement(By.name('username')).sendKeys(config.username);
    await driver.findElement(By.name('password')).sendKeys(config.password);
    
    log('Submitting login form...');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for successful login (dashboard should load)
    await driver.wait(until.elementLocated(By.css('.dashboard-container')), config.waitTimeout);
    
    log('Login successful');
    await takeScreenshot(driver, 'login_success');
    return true;
  } catch (error) {
    log(`Login failed: ${error.message}`);
    await takeScreenshot(driver, 'login_failed');
    return false;
  }
}

// Navigate to Cycle Count page using direct URL approach
async function navigateToCycleCount(driver) {
  try {
    log('Navigating to Cycle Count page...');
    
    // Use direct URL navigation approach
    await driver.get(`${config.baseUrl}/warehouse-cycle-count`);
    
    // Wait for the page to load - look for cycle count heading
    await driver.wait(until.elementLocated(By.css('h1')), config.waitTimeout);
    const heading = await driver.findElement(By.css('h1')).getText();
    
    if (heading.includes('Cycle Count')) {
      log('Successfully navigated to Cycle Count page');
      await takeScreenshot(driver, 'cycle_count_page');
      return true;
    } else {
      log(`Navigation to Cycle Count failed, found heading: ${heading}`);
      await takeScreenshot(driver, 'cycle_count_navigation_failed');
      return false;
    }
  } catch (error) {
    log(`Error navigating to Cycle Count: ${error.message}`);
    await takeScreenshot(driver, 'cycle_count_navigation_error');
    return false;
  }
}

// Create a new Cycle Count task
async function createCycleCountTask(driver) {
  try {
    log('Creating a new Cycle Count task...');
    
    // Click the Create button
    await driver.findElement(By.css('button[data-testid="create-cycle-count-button"]')).click();
    log('Clicked Create button');
    
    // Wait for form to appear
    await driver.wait(until.elementLocated(By.css('form')), config.waitTimeout);
    
    // Fill out the form
    const taskName = `Test Cycle Count ${Date.now()}`;
    await driver.findElement(By.id('name')).sendKeys(taskName);
    log(`Entered task name: ${taskName}`);
    
    // Select counting method: cycle
    const countingMethodDropdown = await driver.findElement(By.id('countingMethod'));
    await countingMethodDropdown.click();
    await driver.findElement(By.css('option[value="cycle"]')).click();
    log('Selected cycle counting method');
    
    // Set scheduled date (today)
    const today = new Date().toISOString().split('T')[0];
    await driver.findElement(By.id('scheduledDate')).sendKeys(today);
    log(`Set scheduled date: ${today}`);
    
    // Add notes
    await driver.findElement(By.id('notes')).sendKeys('Automated test task');
    log('Added notes');
    
    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();
    log('Submitted form');
    
    // Wait for success message or redirect back to list
    try {
      await driver.wait(until.elementLocated(By.css('.toast-success')), config.waitTimeout);
      log('Success message appeared');
    } catch (error) {
      log('No success toast found, checking if we returned to task list');
      await driver.wait(until.elementLocated(By.css('table')), config.waitTimeout);
    }
    
    await takeScreenshot(driver, 'cycle_count_created');
    
    // Verify task was created by checking the task list
    const tableRows = await driver.findElements(By.css('table tbody tr'));
    let taskFound = false;
    
    for (const row of tableRows) {
      const text = await row.getText();
      if (text.includes(taskName)) {
        taskFound = true;
        log(`Task "${taskName}" was successfully created`);
        break;
      }
    }
    
    if (!taskFound) {
      log(`Task "${taskName}" was not found in the task list`);
      return false;
    }
    
    return true;
  } catch (error) {
    log(`Error creating Cycle Count task: ${error.message}`);
    await takeScreenshot(driver, 'cycle_count_creation_error');
    return false;
  }
}

// Run the test
async function runTest() {
  let driver;
  let success = false;
  
  try {
    log('Starting Cycle Count test');
    driver = await setup();
    
    const loggedIn = await login(driver);
    if (!loggedIn) {
      log('Test failed: Unable to login');
      return false;
    }
    
    const navigated = await navigateToCycleCount(driver);
    if (!navigated) {
      log('Test failed: Unable to navigate to Cycle Count page');
      return false;
    }
    
    const taskCreated = await createCycleCountTask(driver);
    if (!taskCreated) {
      log('Test failed: Unable to create Cycle Count task');
      return false;
    }
    
    log('Test completed successfully');
    success = true;
    return true;
  } catch (error) {
    log(`Test failed with error: ${error.message}`);
    if (driver) {
      await takeScreenshot(driver, 'test_failed');
    }
    return false;
  } finally {
    if (driver) {
      await teardown(driver);
    }
    
    if (success) {
      log('🟢 ALL TESTS PASSED');
    } else {
      log('🔴 TEST FAILED');
    }
  }
}

// Run the test
if (require.main === module) {
  runTest().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { runTest };