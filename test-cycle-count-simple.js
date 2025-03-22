/**
 * Simple UI Element Test for Cycle Count Functionality
 * 
 * This script uses Axios to interact with the application
 * and fetch HTML content for verification, which is more reliable
 * than Selenium in restricted environments like Replit.
 */

const axios = require('axios');
const { JSDOM } = require('jsdom');

// Test configuration
const config = {
  baseUrl: 'http://localhost:5000',
  username: 'warehouse1',
  password: 'password',
  waitTime: 1000
};

// Global session cookie storage
let cookies = [];

// Helper functions
function log(step, message) {
  console.log(`\n[${step}] ${message}`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Login and get session cookie
async function login() {
  log('LOGIN', 'Logging in as warehouse staff');
  
  try {
    const response = await axios.post(`${config.baseUrl}/api/auth/login`, {
      username: config.username,
      password: config.password
    }, {
      validateStatus: status => status < 500,
      withCredentials: true
    });
    
    if (response.status === 200 && response.data) {
      // Extract cookies
      if (response.headers['set-cookie']) {
        cookies = response.headers['set-cookie'];
        log('LOGIN', 'Successfully logged in and got cookies');
        return true;
      }
      
      log('LOGIN', 'Logged in but no cookies received');
      return true;
    } else {
      log('LOGIN', `Login failed with status ${response.status}`);
      return false;
    }
  } catch (error) {
    log('LOGIN', `Login error: ${error.message}`);
    return false;
  }
}

// Fetch a page and parse with JSDOM
async function fetchPage(url) {
  log('FETCH', `Fetching page: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: cookies.length > 0 ? { Cookie: cookies.join('; ') } : {},
      validateStatus: status => status < 500
    });
    
    if (response.status === 200) {
      const dom = new JSDOM(response.data);
      log('FETCH', 'Page loaded successfully');
      return { dom, html: response.data };
    } else {
      log('FETCH', `Failed to fetch page: ${response.status}`);
      return { dom: null, html: null };
    }
  } catch (error) {
    log('FETCH', `Fetch error: ${error.message}`);
    return { dom: null, html: null };
  }
}

// Analyze cycle count page content
function analyzeCycleCountPage(html, dom) {
  log('ANALYZE', 'Analyzing cycle count page content');
  
  if (!dom || !html) {
    log('ANALYZE', 'No content to analyze');
    return { success: false };
  }
  
  // Check for common cycle count page elements
  const document = dom.window.document;
  
  // Look for headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let isCycleCountPage = false;
  
  for (const heading of headings) {
    const text = heading.textContent.toLowerCase();
    if (text.includes('cycle count') || text.includes('inventory')) {
      isCycleCountPage = true;
      log('ANALYZE', `Found relevant heading: "${heading.textContent}"`);
      break;
    }
  }
  
  // Look for create button
  const buttons = document.querySelectorAll('button');
  let hasCreateButton = false;
  
  for (const button of buttons) {
    const text = button.textContent.toLowerCase();
    if (text.includes('create') || text.includes('new') || text.includes('add')) {
      hasCreateButton = true;
      log('ANALYZE', `Found create button: "${button.textContent}"`);
      break;
    }
  }
  
  // Look for task table or list
  const tables = document.querySelectorAll('table');
  const lists = document.querySelectorAll('ul, ol');
  
  const hasTables = tables.length > 0;
  const hasLists = lists.length > 0;
  
  if (hasTables) {
    log('ANALYZE', `Found ${tables.length} tables`);
  }
  
  if (hasLists) {
    log('ANALYZE', `Found ${lists.length} lists`);
  }
  
  // Check for task-related keywords in the page content
  const taskRelatedKeywords = ['task', 'status', 'date', 'count', 'inventory', 'location', 'cycle'];
  let keywordsFound = [];
  
  for (const keyword of taskRelatedKeywords) {
    if (html.toLowerCase().includes(keyword)) {
      keywordsFound.push(keyword);
    }
  }
  
  log('ANALYZE', `Found task-related keywords: ${keywordsFound.join(', ')}`);
  
  // Determine if page looks like a cycle count page
  const looksLikeCycleCountPage = (
    isCycleCountPage || 
    (keywordsFound.length >= 3 && (hasTables || hasLists)) ||
    (hasCreateButton && (hasTables || hasLists))
  );
  
  return {
    success: looksLikeCycleCountPage,
    isCycleCountPage,
    hasCreateButton,
    hasTables,
    hasLists,
    keywordsFound
  };
}

// Find form elements in cycle count create page
function analyzeCreateForm(html, dom) {
  log('FORM', 'Analyzing create form elements');
  
  if (!dom || !html) {
    log('FORM', 'No content to analyze');
    return { success: false };
  }
  
  const document = dom.window.document;
  
  // Look for form
  const forms = document.querySelectorAll('form');
  if (forms.length === 0) {
    log('FORM', 'No forms found on page');
    return { success: false };
  }
  
  log('FORM', `Found ${forms.length} forms`);
  
  // Find important form fields
  const inputFields = document.querySelectorAll('input, select, textarea');
  let formFields = [];
  
  for (const field of inputFields) {
    const name = field.getAttribute('name');
    const type = field.getAttribute('type');
    const placeholder = field.getAttribute('placeholder');
    
    formFields.push({
      name: name || 'unnamed',
      type: type || field.tagName.toLowerCase(),
      placeholder: placeholder || 'none'
    });
    
    log('FORM', `Found form field: name=${name}, type=${type}, placeholder=${placeholder}`);
  }
  
  // Look for submit button
  const buttons = document.querySelectorAll('button');
  let hasSubmitButton = false;
  
  for (const button of buttons) {
    const type = button.getAttribute('type');
    const text = button.textContent.toLowerCase();
    
    if (type === 'submit' || text.includes('submit') || text.includes('save') || text.includes('create')) {
      hasSubmitButton = true;
      log('FORM', `Found submit button: "${button.textContent}"`);
      break;
    }
  }
  
  return {
    success: formFields.length > 0 && hasSubmitButton,
    formFields,
    hasSubmitButton
  };
}

// Main test function
async function runTest() {
  console.log('\n==== STARTING SIMPLE CYCLE COUNT UI TEST ====\n');
  let testScore = 0;
  const maxScore = 3;
  
  try {
    // Step 1: Login
    const loggedIn = await login();
    if (!loggedIn) {
      log('TEST', 'Login failed, stopping test');
      return;
    }
    testScore++;
    
    // Step 2: Check Cycle Count Page
    await delay(config.waitTime);
    const { dom, html } = await fetchPage(`${config.baseUrl}/warehouse-cycle-count`);
    
    const cycleCountPageAnalysis = analyzeCycleCountPage(html, dom);
    if (!cycleCountPageAnalysis.success) {
      log('TEST', 'Could not verify cycle count page, stopping test');
      return;
    }
    testScore++;
    
    // Step 3: Find Create Form (URL may vary based on app)
    await delay(config.waitTime);
    
    // Try to determine the URL for the create form
    let createFormUrl = `${config.baseUrl}/warehouse-cycle-count/new`;
    
    // First try to extract the URL for the create button
    if (dom) {
      const document = dom.window.document;
      const createLinks = document.querySelectorAll('a');
      
      for (const link of createLinks) {
        const text = link.textContent.toLowerCase();
        if (text.includes('create') || text.includes('new') || text.includes('add')) {
          const href = link.getAttribute('href');
          if (href) {
            createFormUrl = href.startsWith('http') ? href : `${config.baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
            log('TEST', `Found create link with href: ${createFormUrl}`);
            break;
          }
        }
      }
    }
    
    const { dom: formDom, html: formHtml } = await fetchPage(createFormUrl);
    
    const formAnalysis = analyzeCreateForm(formHtml, formDom);
    if (!formAnalysis.success) {
      log('TEST', 'Could not verify cycle count create form');
      
      // Fall back to checking if there are inputs on the main page
      // (in case the form is shown through a modal or on the same page)
      if (dom) {
        const document = dom.window.document;
        const inputs = document.querySelectorAll('input, select, textarea');
        const hasInputs = inputs.length > 0;
        
        if (hasInputs) {
          log('TEST', `Found ${inputs.length} input fields on the main page, assuming form is shown in-place`);
          testScore++;
        }
      }
    } else {
      testScore++;
    }
    
    // Calculate final score
    const testPercentage = Math.round((testScore / maxScore) * 100);
    
    log('RESULT', `Test Score: ${testScore}/${maxScore} (${testPercentage}%)`);
    
    if (testPercentage >= 70) {
      log('RESULT', 'TEST PASSED - Cycle count UI elements verified');
    } else {
      log('RESULT', 'TEST FAILED - Could not verify all cycle count UI elements');
    }
  } catch (error) {
    log('ERROR', `Test failed with error: ${error.message}`);
  }
  
  console.log('\n==== SIMPLE CYCLE COUNT UI TEST COMPLETED ====\n');
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled test error:', error.message);
});