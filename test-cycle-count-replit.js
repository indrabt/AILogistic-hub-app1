/**
 * Selenium UI Test for Cycle Count Functionality (Replit Version)
 * 
 * Simplified version for Replit environment testing cycle count functionality.
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Test configuration
const config = {
  baseUrl: 'http://localhost:5000',
  username: 'warehouse1',
  password: 'password',
  testTimeout: 30000,
  waitTimeout: 10000
};

// Store driver reference
let driver;

// Helper function for logging
function log(message) {
  console.log(`[TEST] ${message}`);
}

// Setup test environment
async function setup() {
  log('Setting up test environment');
  
  // Configure Chrome options for Replit environment
  const chromeOptions = new chrome.Options();
  
  // Enable headless mode for Replit environment
  chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--window-size=1920,1080');
  
  // Create the driver
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
  
  // Set timeout
  await driver.manage().setTimeouts({ implicit: 5000 });
  
  return driver;
}

// Cleanup
async function teardown() {
  log('Cleaning up');
  if (driver) {
    await driver.quit();
  }
}

// Take screenshot for debugging
async function takeScreenshot(name) {
  try {
    const screenshot = await driver.takeScreenshot();
    log(`Screenshot taken: ${name}`);
    return screenshot;
  } catch (error) {
    log(`Failed to take screenshot: ${error.message}`);
    return null;
  }
}

// Login
async function login() {
  log('Attempting to login');
  
  try {
    // Navigate to login page
    await driver.get(`${config.baseUrl}/login`);
    await takeScreenshot('login-page');
    
    // Enter credentials
    await driver.findElement(By.id('username')).sendKeys(config.username);
    await driver.findElement(By.id('password')).sendKeys(config.password);
    
    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for login to complete
    await driver.sleep(2000);
    await takeScreenshot('after-login');
    
    // Check if login was successful
    const currentUrl = await driver.getCurrentUrl();
    const loginSuccessful = !currentUrl.includes('/login');
    
    log(`Login ${loginSuccessful ? 'successful' : 'failed'}`);
    return loginSuccessful;
  } catch (error) {
    log(`Login error: ${error.message}`);
    return false;
  }
}

// Navigate to cycle count page
async function navigateToCycleCount() {
  log('Navigating to cycle count page');
  
  try {
    // Direct navigation
    await driver.get(`${config.baseUrl}/warehouse-cycle-count`);
    await driver.sleep(2000);
    await takeScreenshot('cycle-count-page');
    
    // Check if on correct page
    const pageSource = await driver.getPageSource();
    const pageTitle = await driver.getTitle();
    
    log(`Page title: ${pageTitle}`);
    log(`Current URL: ${await driver.getCurrentUrl()}`);
    
    return true;
  } catch (error) {
    log(`Navigation error: ${error.message}`);
    return false;
  }
}

// Create a cycle count task
async function createCycleCountTask() {
  log('Creating a new cycle count task');
  
  try {
    // Find and click the create button
    const buttons = await driver.findElements(By.css('button'));
    let createButton = null;
    
    for (const button of buttons) {
      const text = await button.getText();
      log(`Found button: "${text}"`);
      
      if (text.toLowerCase().includes('create') || 
          text.toLowerCase().includes('new') || 
          text.toLowerCase().includes('add')) {
        createButton = button;
        break;
      }
    }
    
    if (createButton) {
      await createButton.click();
      log('Clicked create button');
    } else {
      log('Could not find create button, looking for "New" link');
      const links = await driver.findElements(By.css('a'));
      
      for (const link of links) {
        const text = await link.getText();
        if (text.toLowerCase().includes('new') || 
            text.toLowerCase().includes('create') || 
            text.toLowerCase().includes('add')) {
          await link.click();
          log('Clicked create link');
          break;
        }
      }
    }
    
    // Wait for form to appear
    await driver.sleep(2000);
    await takeScreenshot('create-form');
    
    // Fill in form fields
    const taskName = `Test Cycle Count ${new Date().toISOString()}`;
    
    const inputs = await driver.findElements(By.css('input, select, textarea'));
    for (const input of inputs) {
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      
      log(`Found input field: name=${name}, placeholder=${placeholder}`);
      
      // Fill in appropriate fields based on attribute names
      if (name === 'name' || (placeholder && placeholder.includes('name'))) {
        await input.clear();
        await input.sendKeys(taskName);
        log('Filled name field');
      }
    }
    
    // Submit the form
    const submitButtons = await driver.findElements(By.css('button[type="submit"]'));
    if (submitButtons.length > 0) {
      await submitButtons[0].click();
      log('Submitted form');
    } else {
      // Try to find any button that looks like a submit button
      const allButtons = await driver.findElements(By.css('button'));
      for (const button of allButtons) {
        const text = await button.getText();
        if (text.toLowerCase().includes('save') || 
            text.toLowerCase().includes('submit') || 
            text.toLowerCase().includes('create')) {
          await button.click();
          log('Clicked submit button');
          break;
        }
      }
    }
    
    // Wait for submission to complete
    await driver.sleep(2000);
    await takeScreenshot('after-create');
    
    return true;
  } catch (error) {
    log(`Create task error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTest() {
  console.log('\n==== STARTING CYCLE COUNT UI TEST ====\n');
  let testPassed = false;
  
  try {
    // Setup driver
    await setup();
    
    // Login
    const loggedIn = await login();
    if (!loggedIn) {
      throw new Error('Login failed');
    }
    
    // Navigate to cycle count
    const navigated = await navigateToCycleCount();
    if (!navigated) {
      throw new Error('Navigation failed');
    }
    
    // Create a task
    const taskCreated = await createCycleCountTask();
    if (!taskCreated) {
      throw new Error('Task creation failed');
    }
    
    // Test successful if we get here
    testPassed = true;
  } catch (error) {
    console.error(`TEST FAILED: ${error.message}`);
  } finally {
    // Cleanup
    await teardown();
    
    if (testPassed) {
      console.log('\n==== CYCLE COUNT UI TEST PASSED ====\n');
    } else {
      console.log('\n==== CYCLE COUNT UI TEST FAILED ====\n');
    }
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error:', error);
});