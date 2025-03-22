/**
 * Simple UI Element Test for Cycle Count Functionality
 * 
 * This script uses Axios to interact with the application
 * and fetch HTML content for verification, which is more reliable
 * than Selenium in restricted environments like Replit.
 */

const axios = require('axios');
const { JSDOM } = require('jsdom');

// Configuration
const config = {
  baseUrl: 'http://localhost:5000',
  username: 'wstaff',
  password: 'password'
};

// Utility function for logging
function log(step, message) {
  console.log(`[${step}] ${message}`);
}

// Utility function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Axios instance with cookies enabled
const client = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true
});

// Login to the application
async function login() {
  log('LOGIN', 'Attempting to log in');
  
  try {
    const response = await client.post('/api/auth/login', {
      username: config.username,
      password: config.password
    });
    
    if (response.status === 200 && response.data.success) {
      log('LOGIN', `Successfully logged in as ${config.username} (${response.data.user.role})`);
      return true;
    } else {
      log('LOGIN', `Login failed: ${response.data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    log('LOGIN', `Login failed with error: ${error.message}`);
    return false;
  }
}

// Fetch a page and parse the HTML
async function fetchPage(url) {
  log('FETCH', `Fetching page: ${url}`);
  
  try {
    const response = await client.get(url);
    const dom = new JSDOM(response.data);
    
    log('FETCH', `Successfully fetched page`);
    return { 
      success: true, 
      html: response.data, 
      dom: dom.window.document 
    };
  } catch (error) {
    log('FETCH', `Failed to fetch page: ${error.message}`);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Analyze Cycle Count page content
function analyzeCycleCountPage(html, dom) {
  log('ANALYZE', 'Checking Cycle Count page elements');
  
  // Check for important UI elements that should be present
  const results = {
    title: false,
    createButton: false,
    taskTable: false,
    statusFilters: false,
    errors: []
  };
  
  // Check page title/heading
  const headings = dom.querySelectorAll('h1, h2');
  for (const heading of headings) {
    if (heading.textContent.includes('Cycle Count')) {
      results.title = true;
      log('ANALYZE', `✓ Found page title: "${heading.textContent.trim()}"`);
      break;
    }
  }
  
  if (!results.title) {
    results.errors.push('Missing cycle count title/heading');
    log('ANALYZE', '✗ Could not find page title containing "Cycle Count"');
  }
  
  // Check for Create button
  const buttons = dom.querySelectorAll('button');
  for (const button of buttons) {
    if (button.textContent.includes('Create') || 
        button.getAttribute('data-testid') === 'create-cycle-count-button') {
      results.createButton = true;
      log('ANALYZE', '✓ Found Create button');
      break;
    }
  }
  
  if (!results.createButton) {
    results.errors.push('Missing create button');
    log('ANALYZE', '✗ Could not find Create button');
  }
  
  // Check for task table
  const tables = dom.querySelectorAll('table');
  if (tables.length > 0) {
    results.taskTable = true;
    log('ANALYZE', `✓ Found ${tables.length} table(s)`);
    
    // Check table headers
    const headers = tables[0].querySelectorAll('th');
    const headerTexts = Array.from(headers).map(h => h.textContent.trim());
    log('ANALYZE', `Table headers: ${headerTexts.join(', ')}`);
    
    // Look for expected headers
    const expectedHeaders = ['Name', 'Status', 'Method', 'Scheduled', 'Actions'];
    const missingHeaders = expectedHeaders.filter(eh => 
      !headerTexts.some(h => h.includes(eh))
    );
    
    if (missingHeaders.length > 0) {
      results.errors.push(`Missing table headers: ${missingHeaders.join(', ')}`);
      log('ANALYZE', `✗ Missing expected table headers: ${missingHeaders.join(', ')}`);
    }
  } else {
    results.errors.push('Missing task table');
    log('ANALYZE', '✗ Could not find task table');
  }
  
  // Check for status filters
  const filterElements = dom.querySelectorAll('.status-filter, [data-testid^="status-filter"]');
  if (filterElements.length > 0) {
    results.statusFilters = true;
    log('ANALYZE', `✓ Found ${filterElements.length} status filter(s)`);
  } else {
    // Status filters are often in buttons or tabs
    const filterButtons = Array.from(buttons).filter(b => 
      ['Pending', 'In Progress', 'Completed', 'All'].some(status => 
        b.textContent.includes(status)
      )
    );
    
    if (filterButtons.length > 0) {
      results.statusFilters = true;
      log('ANALYZE', `✓ Found ${filterButtons.length} status filter button(s)`);
    } else {
      results.errors.push('Missing status filters');
      log('ANALYZE', '✗ Could not find status filters');
    }
  }
  
  // Summary
  const successCount = Object.values(results).filter(v => v === true).length;
  log('ANALYZE', `Found ${successCount} out of 4 expected elements`);
  
  return results;
}

// Analyze the Create Form
function analyzeCreateForm(html, dom) {
  log('ANALYZE', 'Checking Create Form elements');
  
  // Check for important form elements that should be present
  const results = {
    nameField: false,
    methodSelector: false,
    dateField: false,
    submitButton: false,
    errors: []
  };
  
  // Check for form
  const forms = dom.querySelectorAll('form');
  if (forms.length === 0) {
    results.errors.push('No form found');
    log('ANALYZE', '✗ Could not find form element');
    return results;
  }
  
  log('ANALYZE', `✓ Found ${forms.length} form(s)`);
  const form = forms[0];
  
  // Check for name field
  const nameInput = form.querySelector('#name, [name="name"]');
  if (nameInput) {
    results.nameField = true;
    log('ANALYZE', '✓ Found name input field');
  } else {
    results.errors.push('Missing name field');
    log('ANALYZE', '✗ Could not find name input field');
  }
  
  // Check for method selector
  const methodSelect = form.querySelector('#countingMethod, [name="countingMethod"]');
  if (methodSelect) {
    results.methodSelector = true;
    log('ANALYZE', '✓ Found counting method selector');
    
    // Check options
    const options = methodSelect.querySelectorAll('option');
    const optionValues = Array.from(options).map(opt => opt.value || opt.textContent.trim());
    log('ANALYZE', `Method options: ${optionValues.join(', ')}`);
  } else {
    results.errors.push('Missing counting method selector');
    log('ANALYZE', '✗ Could not find counting method selector');
  }
  
  // Check for date field
  const dateInput = form.querySelector('#scheduledDate, [name="scheduledDate"], [type="date"]');
  if (dateInput) {
    results.dateField = true;
    log('ANALYZE', '✓ Found scheduled date field');
  } else {
    results.errors.push('Missing scheduled date field');
    log('ANALYZE', '✗ Could not find scheduled date field');
  }
  
  // Check for submit button
  const buttons = form.querySelectorAll('button');
  for (const button of buttons) {
    if (button.getAttribute('type') === 'submit' || 
        button.textContent.includes('Create') || 
        button.textContent.includes('Submit')) {
      results.submitButton = true;
      log('ANALYZE', '✓ Found submit button');
      break;
    }
  }
  
  if (!results.submitButton) {
    results.errors.push('Missing submit button');
    log('ANALYZE', '✗ Could not find submit button');
  }
  
  // Summary
  const successCount = Object.values(results).filter(v => v === true).length;
  log('ANALYZE', `Found ${successCount} out of 4 expected form elements`);
  
  return results;
}

// Run all tests
async function runTest() {
  log('TEST', 'Starting Cycle Count UI test');
  let success = false;
  
  try {
    // Step 1: Login
    const loggedIn = await login();
    if (!loggedIn) {
      throw new Error('Login failed, cannot proceed with tests');
    }
    
    // Step 2: Fetch the Cycle Count page
    const { success: fetchSuccess, html, dom } = await fetchPage('/warehouse-cycle-count');
    if (!fetchSuccess) {
      throw new Error('Failed to fetch Cycle Count page');
    }
    
    // Step 3: Analyze the Cycle Count page
    const pageAnalysis = analyzeCycleCountPage(html, dom);
    if (pageAnalysis.errors.length > 0) {
      log('TEST', `Page analysis found ${pageAnalysis.errors.length} issues`);
    }
    
    // Step 4: Try to navigate to Create Form (if button exists)
    let createFormDom = null;
    if (pageAnalysis.createButton) {
      log('TEST', 'Attempting to access Create form by direct URL');
      
      // Use direct URL to access create form since we can't click the button
      const { success: createFetchSuccess, html: createHtml, dom: createDom } = 
        await fetchPage('/warehouse-cycle-count?action=create');
      
      if (createFetchSuccess) {
        log('TEST', 'Successfully accessed Create form');
        createFormDom = createDom;
        
        // Step 5: Analyze the Create Form
        const formAnalysis = analyzeCreateForm(createHtml, createDom);
        if (formAnalysis.errors.length > 0) {
          log('TEST', `Form analysis found ${formAnalysis.errors.length} issues`);
        }
      } else {
        log('TEST', 'Could not access Create form, skipping form analysis');
      }
    }
    
    // Determine overall test success
    const criticalIssues = pageAnalysis.errors.length > 1;
    success = !criticalIssues && loggedIn;
    
    if (success) {
      log('TEST', 'UI test completed successfully');
      log('RESULT', '🟢 PASS: Basic UI elements for Cycle Count functionality are present');
    } else {
      log('TEST', 'UI test completed with issues');
      log('RESULT', '🟠 PARTIAL PASS: Some UI elements may be missing or inaccessible');
      log('ISSUES', pageAnalysis.errors.join('\n'));
    }
    
    return success;
  } catch (error) {
    log('ERROR', `Test failed: ${error.message}`);
    log('RESULT', '🔴 FAIL: Cycle Count UI test encountered errors');
    return false;
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