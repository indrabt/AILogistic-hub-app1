/**
 * Selenium UI Test for Cycle Count Functionality
 * 
 * This test script uses Selenium WebDriver to test the cycle count functionality
 * with a visible browser (non-headless mode).
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Test configuration
const config = {
  baseUrl: 'http://localhost:5000',
  username: 'warehouse1',
  password: 'password',
  testTimeout: 30000, // 30 seconds
  waitTimeout: 10000 // 10 seconds
};

// Store references for cleanup
let driver;

// Helper function for logging test steps
function logStep(message) {
  console.log(`\n🔍 ${message}`);
}

// Helper function to wait for an element to be clickable
async function waitForElementToBeClickable(selector, timeout = config.waitTimeout) {
  const element = await driver.wait(until.elementLocated(selector), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  return element;
}

// Setup test
async function setup() {
  logStep('Setting up test environment');
  
  // Create Chrome options - disable headless mode
  const chromeOptions = new chrome.Options();
  // Comment out the next line to see the browser window
  // chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--window-size=1920,1080');
  
  // Create the driver
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  // Maximize window
  await driver.manage().window().maximize();
  
  // Set implicit wait time
  await driver.manage().setTimeouts({ implicit: 5000 });
  
  return driver;
}

// Teardown
async function teardown() {
  logStep('Cleaning up test environment');
  if (driver) {
    await driver.quit();
  }
}

// Login to the application
async function login() {
  logStep('Logging in as warehouse staff');
  await driver.get(`${config.baseUrl}/login`);
  
  // Wait for the login form
  const usernameField = await driver.findElement(By.id('username'));
  const passwordField = await driver.findElement(By.id('password'));
  const loginButton = await driver.findElement(By.css('button[type="submit"]'));
  
  // Fill in login details
  await usernameField.sendKeys(config.username);
  await passwordField.sendKeys(config.password);
  await loginButton.click();
  
  // Wait for successful login (redirect to dashboard)
  try {
    // Check for dashboard elements to confirm login
    await driver.wait(until.elementLocated(By.css('.dashboard-container, .sidebar, header.navbar')), config.waitTimeout);
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

// Navigate to cycle count page
async function navigateToCycleCount() {
  logStep('Navigating to cycle count page');
  
  try {
    // Try direct navigation first
    await driver.get(`${config.baseUrl}/warehouse-cycle-count`);
    
    // Check if we're on the cycle count page
    const pageHeader = await driver.wait(
      until.elementLocated(By.css('h1, h2, h3, h4, h5, h6')), 
      config.waitTimeout
    );
    const headerText = await pageHeader.getText();
    
    if (headerText.toLowerCase().includes('cycle count')) {
      console.log('✅ Navigated to cycle count page via direct URL');
      return true;
    }
    
    // If direct navigation failed, try using sidebar menu
    console.log('Direct navigation might not have worked, trying sidebar menu...');
    
    // Look for warehouse or inventory management in sidebar
    const sidebarLinks = await driver.findElements(By.css('.sidebar a, nav a, aside a'));
    
    for (const link of sidebarLinks) {
      const linkText = await link.getText();
      if (linkText.toLowerCase().includes('warehouse') || 
          linkText.toLowerCase().includes('inventory') ||
          linkText.toLowerCase().includes('cycle')) {
        await link.click();
        
        // Wait a moment for sub-menu to appear if applicable
        await driver.sleep(1000);
        
        // Now look for cycle count link
        const allLinks = await driver.findElements(By.css('a'));
        for (const subLink of allLinks) {
          const subLinkText = await subLink.getText();
          if (subLinkText.toLowerCase().includes('cycle count')) {
            await subLink.click();
            
            // Wait for page to load
            await driver.wait(
              until.elementLocated(By.css('h1, h2, h3, h4, h5, h6')), 
              config.waitTimeout
            );
            
            console.log('✅ Navigated to cycle count page via sidebar menu');
            return true;
          }
        }
      }
    }
    
    // If we got here, we couldn't find cycle count link
    console.error('❌ Could not find cycle count link in sidebar');
    return false;
  } catch (error) {
    console.error('❌ Navigation failed:', error.message);
    return false;
  }
}

// Create a new cycle count task
async function createCycleCountTask() {
  logStep('Creating a new cycle count task');
  
  try {
    // Look for a "Create" or "New" button
    const createButtons = await driver.findElements(
      By.css('button, a.button, a.btn, [role="button"]')
    );
    
    let createButton;
    for (const button of createButtons) {
      const text = await button.getText();
      if (text.toLowerCase().includes('create') || 
          text.toLowerCase().includes('new') || 
          text.toLowerCase().includes('add')) {
        createButton = button;
        break;
      }
    }
    
    if (!createButton) {
      console.error('❌ Could not find create button');
      return false;
    }
    
    // Click the create button
    await createButton.click();
    
    // Wait for form to appear
    await driver.wait(
      until.elementLocated(By.css('form, [role="form"]')), 
      config.waitTimeout
    );
    
    // Fill in the form fields
    const taskName = `UI Test Cycle Count ${new Date().toISOString()}`;
    
    // Look for name input
    const nameInput = await driver.findElement(By.css('input[name="name"], input[placeholder*="name"], input[placeholder*="Name"]'));
    await nameInput.clear();
    await nameInput.sendKeys(taskName);
    
    // Look for counting method dropdown
    try {
      const methodSelect = await driver.findElement(By.css('select[name="countingMethod"], [role="combobox"]'));
      await methodSelect.click();
      
      // Select 'cycle' option
      const options = await methodSelect.findElements(By.css('option'));
      for (const option of options) {
        const optionText = await option.getText();
        if (optionText.toLowerCase().includes('cycle')) {
          await option.click();
          break;
        }
      }
    } catch (error) {
      console.log('No standard dropdown found, looking for custom select...');
      
      // Try to handle custom selects
      const customSelects = await driver.findElements(
        By.css('[role="combobox"], .select, .dropdown')
      );
      
      for (const select of customSelects) {
        const selectText = await select.getText();
        if (selectText.toLowerCase().includes('method') || 
            selectText.toLowerCase().includes('type') ||
            selectText.toLowerCase().includes('count')) {
          await select.click();
          
          // Wait for dropdown to open
          await driver.sleep(500);
          
          // Look for cycle option
          const options = await driver.findElements(By.css('li, [role="option"], .option'));
          for (const option of options) {
            const optionText = await option.getText();
            if (optionText.toLowerCase().includes('cycle')) {
              await option.click();
              break;
            }
          }
          break;
        }
      }
    }
    
    // Set date field
    try {
      const dateInput = await driver.findElement(
        By.css('input[type="date"], input[name="scheduledDate"], input[placeholder*="date"], [data-testid*="date"]')
      );
      
      // Format today's date as YYYY-MM-DD
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      await dateInput.clear();
      await dateInput.sendKeys(formattedDate);
    } catch (error) {
      console.log('Date field not found or not standard, skipping...');
    }
    
    // Select locations (if there's a multi-select)
    try {
      // Look for elements that might be location selectors
      const locationSelectors = await driver.findElements(
        By.css('.location-select, [name*="location"], [placeholder*="location"], [aria-label*="location"]')
      );
      
      if (locationSelectors.length > 0) {
        // Click the first one to open dropdown
        await locationSelectors[0].click();
        
        // Wait for dropdown to open
        await driver.sleep(500);
        
        // Select first 2-3 options
        const options = await driver.findElements(By.css('li, [role="option"], .option, input[type="checkbox"]'));
        for (let i = 0; i < Math.min(3, options.length); i++) {
          await options[i].click();
          await driver.sleep(300); // Small delay between selections
        }
        
        // Close dropdown if needed (click outside)
        await driver.findElement(By.css('body')).click();
      }
    } catch (error) {
      console.log('Location selection failed, skipping:', error.message);
    }
    
    // Add notes
    try {
      const notesInput = await driver.findElement(
        By.css('textarea, input[name="notes"], [placeholder*="note"]')
      );
      await notesInput.clear();
      await notesInput.sendKeys('Created by Selenium UI test');
    } catch (error) {
      console.log('Notes field not found, skipping...');
    }
    
    // Submit the form
    const submitButton = await driver.findElement(
      By.css('button[type="submit"], button:contains("Save"), button:contains("Create"), [type="submit"]')
    );
    await submitButton.click();
    
    // Wait for success indicator or redirect
    try {
      await driver.wait(until.elementLocated(
        By.css('.success, .alert-success, .notification')
      ), config.waitTimeout);
      console.log('✅ Cycle count task created successfully via UI');
      return true;
    } catch (error) {
      // If no success message, check if we're back at the task list
      await driver.wait(until.elementLocated(
        By.css('table, .task-list, .cycle-count-list')
      ), config.waitTimeout);
      console.log('✅ Returned to task list after creation - assuming success');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to create cycle count task:', error.message);
    return false;
  }
}

// Verify the task was created
async function verifyTaskCreated() {
  logStep('Verifying task creation');
  
  try {
    // Wait for tasks table/list to be visible
    await driver.wait(until.elementLocated(
      By.css('table, .task-list, .cycle-count-list')
    ), config.waitTimeout);
    
    // For datatable implementations, wait for data to load
    await driver.sleep(1000);
    
    // Check if our task is in the list
    const tableRows = await driver.findElements(By.css('tr, .task-item, .list-item'));
    
    if (tableRows.length > 0) {
      console.log(`✅ Found ${tableRows.length} tasks in the list`);
      
      // Try to look for the latest created task (usually first in the list)
      const firstTask = tableRows[0];
      const taskName = await firstTask.getText();
      console.log(`First task in list: ${taskName}`);
      
      if (taskName.includes('UI Test Cycle Count')) {
        console.log('✅ Found our newly created task');
        return { success: true, taskRow: firstTask };
      }
      
      // Check all tasks if the first one is not ours
      for (const row of tableRows) {
        const text = await row.getText();
        if (text.includes('UI Test Cycle Count')) {
          console.log('✅ Found our newly created task');
          return { success: true, taskRow: row };
        }
      }
      
      console.log('⚠️ Could not find our specific task, but tasks exist');
      return { success: true, taskRow: tableRows[0] }; // Use first task for next step
    } else {
      console.error('❌ No tasks found in the list');
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Task verification failed:', error.message);
    return { success: false };
  }
}

// Update cycle count task status
async function updateTaskStatus(taskRow) {
  logStep('Updating task status');
  
  try {
    // Look for action buttons in the task row
    let actionButtons = await taskRow.findElements(
      By.css('button, a.button, a.btn, [role="button"]')
    );
    
    // If no buttons found directly in row, try to find by relative positioning
    if (actionButtons.length === 0) {
      // Try to get the ID or any identifier from the row
      const rowText = await taskRow.getText();
      console.log(`Looking for actions for task: ${rowText}`);
      
      // Look for buttons anywhere on the page (may need to filter later)
      actionButtons = await driver.findElements(
        By.css('button, a.button, a.btn, [role="button"]')
      );
    }
    
    // Filter buttons to find start/begin/update actions
    let actionButton;
    for (const button of actionButtons) {
      const text = await button.getText();
      if (text.toLowerCase().includes('start') || 
          text.toLowerCase().includes('begin') || 
          text.toLowerCase().includes('edit') ||
          text.toLowerCase().includes('update') ||
          text.toLowerCase().includes('view')) {
        actionButton = button;
        break;
      }
    }
    
    if (!actionButton) {
      console.error('❌ Could not find action button');
      return false;
    }
    
    // Click the action button
    await actionButton.click();
    
    // Wait for form or detail view to appear
    await driver.wait(until.elementLocated(
      By.css('form, .details, .task-details')
    ), config.waitTimeout);
    
    // Look for status dropdown or buttons to change status
    let statusChanged = false;
    
    // Try to find status dropdown
    try {
      const statusSelect = await driver.findElement(
        By.css('select[name="status"], [role="combobox"][aria-label*="status"]')
      );
      await statusSelect.click();
      
      // Select 'in_progress' or similar option
      const options = await statusSelect.findElements(By.css('option'));
      for (const option of options) {
        const optionText = await option.getText();
        if (optionText.toLowerCase().includes('progress') || 
            optionText.toLowerCase().includes('started')) {
          await option.click();
          statusChanged = true;
          break;
        }
      }
    } catch (error) {
      console.log('No standard status dropdown found, looking for custom status controls...');
      
      // Try to handle custom selects
      const customSelects = await driver.findElements(
        By.css('[role="combobox"], .select, .dropdown')
      );
      
      for (const select of customSelects) {
        const selectText = await select.getText();
        if (selectText.toLowerCase().includes('status')) {
          await select.click();
          
          // Wait for dropdown to open
          await driver.sleep(500);
          
          // Look for "in progress" option
          const options = await driver.findElements(By.css('li, [role="option"], .option'));
          for (const option of options) {
            const optionText = await option.getText();
            if (optionText.toLowerCase().includes('progress') || 
                optionText.toLowerCase().includes('started')) {
              await option.click();
              statusChanged = true;
              break;
            }
          }
          break;
        }
      }
    }
    
    // If no dropdown found, look for specific status action buttons
    if (!statusChanged) {
      const statusButtons = await driver.findElements(
        By.css('button, .btn, [role="button"]')
      );
      
      for (const button of statusButtons) {
        const buttonText = await button.getText();
        if (buttonText.toLowerCase().includes('start') || 
            buttonText.toLowerCase().includes('begin') || 
            buttonText.toLowerCase().includes('progress')) {
          await button.click();
          statusChanged = true;
          break;
        }
      }
    }
    
    if (!statusChanged) {
      console.error('❌ Could not change task status');
      return false;
    }
    
    // Submit form if needed
    try {
      const submitButton = await driver.findElement(
        By.css('button[type="submit"], button:contains("Save"), button:contains("Update"), [type="submit"]')
      );
      await submitButton.click();
    } catch (error) {
      console.log('No submit button found, status might have been updated immediately');
    }
    
    // Wait for success indicator or redirect
    try {
      await driver.wait(until.elementLocated(
        By.css('.success, .alert-success, .notification')
      ), config.waitTimeout);
      console.log('✅ Task status updated successfully via UI');
      return true;
    } catch (error) {
      // If no success message, check if we're back at the task list
      await driver.wait(until.elementLocated(
        By.css('table, .task-list, .cycle-count-list')
      ), config.waitTimeout);
      console.log('✅ Returned to task list after update - assuming success');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to update task status:', error.message);
    return false;
  }
}

// Verify task status was updated
async function verifyStatusUpdated() {
  logStep('Verifying status update');
  
  try {
    // Wait for tasks table/list to be visible
    await driver.wait(until.elementLocated(
      By.css('table, .task-list, .cycle-count-list')
    ), config.waitTimeout);
    
    // For datatable implementations, wait for data to load
    await driver.sleep(1000);
    
    // Check task statuses in the list
    const tableRows = await driver.findElements(By.css('tr, .task-item, .list-item'));
    
    if (tableRows.length > 0) {
      // Look for status indicators
      let statusFound = false;
      
      for (const row of tableRows) {
        const rowText = await row.getText();
        
        // Check if this is our task by looking for "UI Test" in the text
        if (rowText.includes('UI Test')) {
          // Now check for "in progress" or similar text
          if (rowText.toLowerCase().includes('in progress') || 
              rowText.toLowerCase().includes('started')) {
            console.log('✅ Task status shows as "in progress" or "started"');
            statusFound = true;
            break;
          }
          
          // If task is found but status text is not obvious, check for status elements
          const statusElements = await row.findElements(
            By.css('.status, .badge, .tag, [data-status]')
          );
          
          for (const statusElement of statusElements) {
            const status = await statusElement.getText();
            const classes = await statusElement.getAttribute('class');
            
            console.log(`Found status: "${status}" with classes: ${classes}`);
            
            if (status.toLowerCase().includes('progress') || 
                status.toLowerCase().includes('started') ||
                classes.includes('progress') ||
                classes.includes('started')) {
              console.log('✅ Found status indicator showing task is in progress');
              statusFound = true;
              break;
            }
          }
        }
      }
      
      return statusFound;
    } else {
      console.error('❌ No tasks found in the list');
      return false;
    }
  } catch (error) {
    console.error('❌ Status verification failed:', error.message);
    return false;
  }
}

// Main test function
async function runTest() {
  console.log('\n🧪 RUNNING CYCLE COUNT UI TEST 🧪\n');
  let success = false;
  
  try {
    // Setup
    await setup();
    
    // Login
    const loggedIn = await login();
    if (!loggedIn) {
      throw new Error('Login failed, stopping test');
    }
    
    // Navigate to cycle count page
    const navigated = await navigateToCycleCount();
    if (!navigated) {
      throw new Error('Navigation failed, stopping test');
    }
    
    // Create cycle count task
    const taskCreated = await createCycleCountTask();
    if (!taskCreated) {
      throw new Error('Task creation failed, stopping test');
    }
    
    // Verify task was created
    const { success: taskVerified, taskRow } = await verifyTaskCreated();
    if (!taskVerified || !taskRow) {
      throw new Error('Task verification failed, stopping test');
    }
    
    // Update task status
    const statusUpdated = await updateTaskStatus(taskRow);
    if (!statusUpdated) {
      throw new Error('Status update failed, stopping test');
    }
    
    // Verify status update
    const statusVerified = await verifyStatusUpdated();
    if (!statusVerified) {
      throw new Error('Status verification failed');
    } else {
      success = true;
    }
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
  } finally {
    // Cleanup
    await teardown();
    
    if (success) {
      console.log('\n✅ CYCLE COUNT UI TEST COMPLETED SUCCESSFULLY\n');
    } else {
      console.log('\n❌ CYCLE COUNT UI TEST FAILED\n');
    }
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled test error:', error);
});