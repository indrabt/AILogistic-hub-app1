/**
 * Direct API test for Cycle Count functionality
 * This is an alternative to browser-based Playwright testing
 */

import axios from 'axios';

// Configuration
const config = {
  baseUrl: 'http://localhost:5000',
  username: 'warehouse1',
  password: 'password',
  apiEndpoint: '/api/warehouse/cycle-counts'
};

// Utility function for logging test results
function logResult(step, success, message, data = null) {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] ${step}: ${message}`);
  
  if (data) {
    console.log('  Data:', JSON.stringify(data, null, 2).substring(0, 200) + (JSON.stringify(data, null, 2).length > 200 ? '...' : ''));
  }
  
  return success;
}

// Axios instance with cookies enabled
const client = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true
});

// Login to the application
async function login() {
  try {
    console.log('\n[LOGIN] Attempting to log in as', config.username);
    
    const response = await client.post('/api/auth/login', {
      username: config.username,
      password: config.password
    });
    
    if (response.status === 200) {
      return logResult('LOGIN', true, `Logged in as ${response.data.username} (${response.data.role})`, response.data);
    } else {
      return logResult('LOGIN', false, response.data.message || 'Unknown error');
    }
  } catch (error) {
    return logResult('LOGIN', false, `Error: ${error.message}`);
  }
}

// Get all cycle count tasks
async function getAllCycleCountTasks(headers) {
  try {
    console.log('\n[GET TASKS] Fetching all cycle count tasks');
    
    const response = await client.get(config.apiEndpoint, { headers });
    
    if (response.status === 200) {
      logResult('GET TASKS', true, `Retrieved ${response.data.length} tasks`, response.data);
      return response.data;
    } else {
      logResult('GET TASKS', false, 'Failed to retrieve tasks');
      return [];
    }
  } catch (error) {
    logResult('GET TASKS', false, `Error: ${error.message}`);
    return [];
  }
}

// Extract a task ID from a list of tasks
// Returns the ID of the first task, or null if no tasks exist
function extractTaskId(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data[0].id;
  }
  return null;
}

// Create a new cycle count task
async function createCycleCountTask(headers) {
  try {
    console.log('\n[CREATE TASK] Creating a new cycle count task');
    
    const task = {
      name: `Test Cycle Count ${Date.now()}`,
      countingMethod: 'cycle',
      status: 'pending',
      scheduledDate: new Date().toISOString().split('T')[0],
      locations: [],
      notes: 'Created by API test'
    };
    
    const response = await client.post(config.apiEndpoint, task, { headers });
    
    if (response.status === 201 || response.status === 200) {
      logResult('CREATE TASK', true, 'Task created successfully', response.data);
      return response.data; // Return the task data directly
    } else {
      logResult('CREATE TASK', false, 'Failed to create task');
      return null;
    }
  } catch (error) {
    logResult('CREATE TASK', false, `Error: ${error.message}`);
    return null;
  }
}

// Update a cycle count task
async function updateCycleCountTask(headers, taskId) {
  try {
    console.log(`\n[UPDATE TASK] Updating cycle count task ${taskId}`);
    
    const update = {
      status: 'in_progress',
      startedAt: new Date().toISOString()
    };
    
    const response = await client.patch(`${config.apiEndpoint}/${taskId}`, update, { headers });
    
    if (response.status === 200) {
      logResult('UPDATE TASK', true, 'Task updated successfully', response.data);
      return response.data;
    } else {
      logResult('UPDATE TASK', false, 'Failed to update task');
      return null;
    }
  } catch (error) {
    logResult('UPDATE TASK', false, `Error: ${error.message}`);
    return null;
  }
}

// Get a specific cycle count task
async function getCycleCountTask(headers, taskId) {
  try {
    console.log(`\n[GET TASK] Fetching cycle count task ${taskId}`);
    
    const response = await client.get(`${config.apiEndpoint}/${taskId}`, { headers });
    
    if (response.status === 200) {
      logResult('GET TASK', true, 'Task retrieved successfully', response.data);
      return response.data;
    } else {
      logResult('GET TASK', false, 'Failed to retrieve task');
      return null;
    }
  } catch (error) {
    logResult('GET TASK', false, `Error: ${error.message}`);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🔍 CYCLE COUNT API TEST');
  console.log('======================');
  
  // Step 1: Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.log('\n❌ TEST FAILED: Could not log in');
    return false;
  }
  
  // Common headers for all requests
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Step 2: Retrieve existing tasks (if any)
  const tasksRetrieved = await getAllCycleCountTasks(headers);
  
  let taskId = null;
  if (tasksRetrieved && Array.isArray(tasksRetrieved)) {
    taskId = extractTaskId(tasksRetrieved);
    console.log(`Existing task ID: ${taskId || 'None found'}`);
  }
  
  // Step 3: Create a new task
  const taskCreated = await createCycleCountTask(headers);
  
  // Get the ID of the newly created task
  if (taskCreated) {
    taskId = taskCreated.id;
    console.log(`New task created with ID: ${taskId}`);
  } else {
    // If task creation failed but we have an existing task, use that
    if (!taskId) {
      console.log('\n❌ TEST PARTIALLY FAILED: Could not create or find a task');
      return false;
    }
  }
  
  // Step 4: Get the specific task
  const taskRetrieved = await getCycleCountTask(headers, taskId);
  if (!taskRetrieved) {
    console.log('\n❌ TEST PARTIALLY FAILED: Could not retrieve the task');
    // Continue anyway to test update
  }
  
  // Step 5: Update the task
  const taskUpdated = await updateCycleCountTask(headers, taskId);
  if (!taskUpdated) {
    console.log('\n❌ TEST PARTIALLY FAILED: Could not update the task');
    // Continue anyway to verify if task was updated despite error
  }
  
  // Step 6: Verify the update worked
  const updatedTaskRetrieved = await getCycleCountTask(headers, taskId);
  let updateVerified = false;
  
  if (updatedTaskRetrieved) {
    // Check if the status is now 'in_progress'
    const task = updatedTaskRetrieved.data || updatedTaskRetrieved;
    if (task && task.status === 'in_progress') {
      updateVerified = true;
      logResult('VERIFY UPDATE', true, 'Task status was updated to in_progress');
    } else {
      logResult('VERIFY UPDATE', false, `Task status is ${task ? task.status : 'undefined'}, expected 'in_progress'`);
    }
  }
  
  // Finalize test results
  const allPassed = loggedIn && (taskCreated || tasksRetrieved) && updatedTaskRetrieved && updateVerified;
  
  if (allPassed) {
    console.log('\n✅ ALL TESTS PASSED');
    return true;
  } else {
    console.log('\n⚠️ SOME TESTS FAILED');
    return false;
  }
}

// Run the test if file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { runTests };