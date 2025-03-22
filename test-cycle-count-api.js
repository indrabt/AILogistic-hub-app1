/**
 * Direct API test for Cycle Count functionality
 * This is an alternative to browser-based Playwright testing
 */

import axios from 'axios';

// Base URL for API requests
const baseUrl = 'http://localhost:5000';

// Storage for task IDs
let createdTaskId = null;

// Helper function to log results
function logResult(step, success, message, data = null) {
  console.log(`\n[${success ? 'PASS' : 'FAIL'}] ${step}`);
  if (message) console.log(`  ${message}`);
  if (data) console.log('  Data:', JSON.stringify(data, null, 2).substring(0, 500));
}

// Login function to get authenticated session
async function login() {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      username: 'warehouse1',
      password: 'password'
    }, {
      withCredentials: true,
      validateStatus: status => status < 500
    });
    
    // Our actual API returns the user object directly on success
    if (response.status === 200 && response.data) {
      logResult('Login', true, 'Successfully logged in as warehouse1', response.data);
      
      // Return cookies for subsequent requests if available
      const cookies = response.headers['set-cookie'];
      // Even if no cookies, return empty headers object since we've logged in
      return cookies ? { Cookie: cookies[0].split(';')[0] } : {};
    } else {
      logResult('Login', false, 'Failed to login', response.data);
      return null;
    }
  } catch (error) {
    logResult('Login', false, `Error: ${error.message}`);
    return null;
  }
}

// Get all cycle count tasks
async function getAllCycleCountTasks(headers) {
  try {
    const response = await axios.get(`${baseUrl}/api/warehouse/cycle-counts`, {
      headers,
      validateStatus: status => status < 500
    });
    
    if (response.status === 200) {
      logResult('Get Cycle Count Tasks', true, `Found ${response.data.length} tasks`);
      return response.data;
    } else {
      logResult('Get Cycle Count Tasks', false, 'Failed to get tasks', response.data);
      return [];
    }
  } catch (error) {
    logResult('Get Cycle Count Tasks', false, `Error: ${error.message}`);
    return [];
  }
}

// Helper function to extract ID from response
function extractTaskId(data) {
  if (!data) return null;
  
  // If it's already a number or string, return it
  if (typeof data === 'number' || typeof data === 'string') {
    return data;
  }
  
  // If data has an id property, use it
  if (data.id) {
    return data.id;
  }
  
  // Try to parse JSON if it's a string
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (parsed && parsed.id) {
        return parsed.id;
      }
    } catch (e) {
      // Not JSON, continue
    }
  }
  
  return null;
}

// Create a new cycle count task
async function createCycleCountTask(headers) {
  try {
    const timestamp = new Date().toISOString();
    const newTask = {
      name: `Test Cycle Count ${timestamp}`,
      countingMethod: "cycle",
      scheduledDate: timestamp.split('T')[0],
      locations: [1, 2, 3],
      notes: "Created by automated API test"
    };
    
    const response = await axios.post(`${baseUrl}/api/warehouse/cycle-counts`, newTask, {
      headers,
      validateStatus: status => status < 500
    });
    
    if (response.status === 201 || response.status === 200) {
      const task = response.data;
      const taskId = extractTaskId(task);
      createdTaskId = taskId;
      
      logResult('Create Cycle Count Task', true, `Successfully created task #${taskId || 'unknown'}`, task);
      return task;
    } else {
      logResult('Create Cycle Count Task', false, 'Failed to create task', response.data);
      return null;
    }
  } catch (error) {
    logResult('Create Cycle Count Task', false, `Error: ${error.message}`);
    return null;
  }
}

// Update a cycle count task
async function updateCycleCountTask(headers, taskId) {
  try {
    const updates = {
      status: "in_progress",
      notes: "Updated by automated API test"
    };
    
    const response = await axios.patch(`${baseUrl}/api/warehouse/cycle-counts/${taskId}`, updates, {
      headers,
      validateStatus: status => status < 500
    });
    
    if (response.status === 200) {
      logResult('Update Cycle Count Task', true, `Successfully updated task #${taskId}`, response.data);
      return response.data;
    } else {
      logResult('Update Cycle Count Task', false, `Failed to update task #${taskId}`, response.data);
      return null;
    }
  } catch (error) {
    logResult('Update Cycle Count Task', false, `Error: ${error.message}`);
    return null;
  }
}

// Get a single cycle count task
async function getCycleCountTask(headers, taskId) {
  try {
    const response = await axios.get(`${baseUrl}/api/warehouse/cycle-counts/${taskId}`, {
      headers,
      validateStatus: status => status < 500
    });
    
    if (response.status === 200) {
      logResult('Get Cycle Count Task', true, `Successfully retrieved task #${taskId}`, response.data);
      return response.data;
    } else {
      logResult('Get Cycle Count Task', false, `Failed to retrieve task #${taskId}`, response.data);
      return null;
    }
  } catch (error) {
    logResult('Get Cycle Count Task', false, `Error: ${error.message}`);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('\n🧪 RUNNING CYCLE COUNT API TESTS 🧪\n');
  
  // Step 1: Login
  const headers = await login();
  if (!headers) {
    console.log('\n❌ Test Failed: Unable to login');
    return;
  }
  
  // Step 2: Get all tasks
  const initialTasks = await getAllCycleCountTasks(headers);
  console.log(`Initial task count: ${initialTasks.length || 0}`);
  
  // Step 3: Create a task
  const createdTask = await createCycleCountTask(headers);
  
  // Debug the response
  console.log('Raw response from create task: ', typeof createdTask, createdTask ? 'has data' : 'is null');
  
  // Analyze the response to see if it's HTML instead of JSON
  if (createdTask && typeof createdTask === 'string' && createdTask.includes('<!DOCTYPE html>')) {
    console.log('WARNING: Received HTML response instead of JSON. The server might be returning the wrong content type.');
    
    // Try to find a task ID in the HTML (this is a fallback approach)
    const matches = createdTask.match(/task\s+#(\d+)/i);
    if (matches && matches[1]) {
      createdTaskId = parseInt(matches[1]);
      console.log(`Extracted task ID ${createdTaskId} from HTML response`);
    }
  }
  
  // Step 4: Get all tasks again to verify count increased
  const updatedTasks = await getAllCycleCountTasks(headers);
  console.log(`Updated task count: ${updatedTasks.length || 0}`);
  
  // Compare before and after counts
  const initialCount = Array.isArray(initialTasks) ? initialTasks.length : 0;
  const updatedCount = Array.isArray(updatedTasks) ? updatedTasks.length : 0;
  
  const countCheck = updatedCount > initialCount;
  logResult(
    'Verify Task Count Increased', 
    countCheck,
    countCheck ? 'Task count increased as expected' : 'Task count did not increase'
  );
  
  // Extra validation: check if our new task appears in the updated list
  if (Array.isArray(updatedTasks) && createdTaskId) {
    const foundTask = updatedTasks.find(task => task.id === createdTaskId);
    if (foundTask) {
      logResult('Find Created Task in List', true, `Task #${createdTaskId} found in task list`);
    } else {
      logResult('Find Created Task in List', false, `Task #${createdTaskId} not found in updated task list`);
    }
  }
  
  // Step 5: Update the created task
  if (createdTaskId) {
    console.log(`Attempting to update task #${createdTaskId}`);
    const updatedTask = await updateCycleCountTask(headers, createdTaskId);
    
    // Step 6: Get the single task to verify update
    if (updatedTask) {
      const verifyTask = await getCycleCountTask(headers, createdTaskId);
      
      if (verifyTask) {
        const statusCheck = verifyTask.status === 'in_progress';
        logResult(
          'Verify Status Updated',
          statusCheck,
          statusCheck ? 'Task status updated correctly' : `Expected in_progress, got ${verifyTask.status}`
        );
      }
    }
  } else {
    console.log('Skipping update test: No valid task ID was captured');
  }
  
  console.log('\n✅ CYCLE COUNT API TESTS COMPLETED\n');
}

// Run the tests
runTests().catch(error => {
  console.error('Test script error:', error);
});

// Export for module compatibility
export default runTests;