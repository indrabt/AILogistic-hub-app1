/**
 * Test script for warehouse Pick and Pack buttons
 * This script directly tests the API endpoints for starting a pick/pack task
 */

async function testPickTask(id) {
  console.log(`Testing picking task ${id} API endpoint...`);
  
  try {
    const updateData = {
      status: "in_progress",
      assignedTo: "warehouse1",
      startedAt: new Date().toISOString()
    };
    
    // Test the PATCH endpoint for picking tasks
    const response = await fetch(`/api/warehouse/pick-tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include'
    });
    
    console.log(`Response status for picking task ${id}: ${response.status}`);
    
    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await response.text();
      }
      console.error(`Failed to update pick task: ${response.status} ${response.statusText}`, errorText);
      return { success: false, error: errorText };
    }
    
    const updatedTask = await response.json();
    console.log(`Task ${id} updated successfully:`, updatedTask);
    return { success: true, task: updatedTask };
    
  } catch (error) {
    console.error(`Error testing pick task ${id}:`, error);
    return { success: false, error: error.message };
  }
}

async function testPackTask(id) {
  console.log(`Testing packing task ${id} API endpoint...`);
  
  try {
    const updateData = {
      status: "in_progress",
      assignedTo: "warehouse1",
      startedAt: new Date().toISOString()
    };
    
    // Test the PATCH endpoint for packing tasks
    const response = await fetch(`/api/warehouse/packing-tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include'
    });
    
    console.log(`Response status for packing task ${id}: ${response.status}`);
    
    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await response.text();
      }
      console.error(`Failed to update pack task: ${response.status} ${response.statusText}`, errorText);
      return { success: false, error: errorText };
    }
    
    const updatedTask = await response.json();
    console.log(`Task ${id} updated successfully:`, updatedTask);
    return { success: true, task: updatedTask };
    
  } catch (error) {
    console.error(`Error testing pack task ${id}:`, error);
    return { success: false, error: error.message };
  }
}

// This function will run tests when the script is loaded in a browser console
async function runTests() {
  console.log('Starting warehouse button tests...');
  
  // Test pick task 1
  const pickResult = await testPickTask(1);
  console.log('Pick task test result:', pickResult);
  
  // Test pack task 1
  const packResult = await testPackTask(1);
  console.log('Pack task test result:', packResult);
  
  console.log('All tests completed');
}

// Detect if we're in Node.js or browser
if (typeof window === 'undefined') {
  // Node.js environment
  console.log('Running in Node.js environment - tests will not run automatically');
  module.exports = { testPickTask, testPackTask, runTests };
} else {
  // Browser environment
  console.log('Running in browser environment - tests will run automatically');
  runTests();
}