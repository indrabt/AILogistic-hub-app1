/**
 * Direct API test for Cycle Count functionality
 * This is an alternative to browser-based Playwright testing
 */

const axios = require('axios');

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
    
    if (response.status === 200 && response.data.success) {
      logResult('Login', true, 'Successfully logged in as warehouse1', response.data);
      
      // Return cookies for subsequent requests if available
      const cookies = response.headers['set-cookie'];
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
    const response = await axios.get(`${baseUrl}/api/warehouse/cycle-count-tasks`, {
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

// Create a new cycle count task
async function createCycleCountTask(headers) {
  try {
    const newTask = {
      name: `Test Cycle Count ${new Date().toISOString()}`,
      countingMethod: "cycle",
      status: "pending",
      scheduledDate: new Date().toISOString().split('T')[0],
      locations: [1, 2, 3],
      notes: "Created by automated API test"
    };
    
    const response = await axios.post(`${baseUrl}/api/warehouse/cycle-count-tasks`, newTask, {
      headers,
      validateStatus: status => status < 500
    });
    
    if (response.status === 201 || response.status === 200) {
      const task = response.data;
      createdTaskId = task.id;
      logResult('Create Cycle Count Task', true, `Successfully created task #${task.id}`, task);
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
      startedAt: new Date().toISOString(),
      notes: "Updated by automated API test"
    };
    
    const response = await axios.patch(`${baseUrl}/api/warehouse/cycle-count-tasks/${taskId}`, updates, {
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
    const response = await axios.get(`${baseUrl}/api/warehouse/cycle-count-tasks/${taskId}`, {
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
  console.log(`Initial task count: ${initialTasks.length}`);
  
  // Step 3: Create a task
  const createdTask = await createCycleCountTask(headers);
  if (!createdTask) {
    console.log('\n❌ Test Failed: Unable to create task');
    return;
  }
  
  // Step 4: Get all tasks again to verify count increased
  const updatedTasks = await getAllCycleCountTasks(headers);
  console.log(`Updated task count: ${updatedTasks.length}`);
  
  const countCheck = updatedTasks.length > initialTasks.length;
  logResult(
    'Verify Task Count Increased', 
    countCheck,
    countCheck ? 'Task count increased as expected' : 'Task count did not increase'
  );
  
  // Step 5: Update the created task
  if (createdTaskId) {
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
  }
  
  console.log('\n✅ CYCLE COUNT API TESTS COMPLETED\n');
}

// Run the tests
runTests().catch(error => {
  console.error('Test script error:', error);
});