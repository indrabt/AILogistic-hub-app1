/**
 * Test script for the Start Packing API
 * This script directly tests the API endpoints for starting a packing task
 */

const taskId = 1; // Change to an available task ID with "pending" status

// Function to start a packing task
async function startPackingTask(id) {
  console.log(`Testing Start Packing API for task ID: ${id}`);
  
  try {
    const updateData = {
      status: "in_progress",
      assignedTo: "warehouse1",
      startedAt: new Date().toISOString()
    };
    
    console.log('Sending update data:', updateData);
    
    const response = await fetch(`http://localhost:5000/api/warehouse/packing-tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Response status:', response.status);
    
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${responseText}`);
    }
    
    try {
      const updatedTask = JSON.parse(responseText);
      console.log('Parsed response:', updatedTask);
      
      // Verify the task updated correctly
      if (updatedTask.status === 'in_progress') {
        console.log('SUCCESS: Task status correctly updated to in_progress');
      } else {
        console.log(`ERROR: Task status is ${updatedTask.status}, expected in_progress`);
      }
      
      return updatedTask;
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return null;
    }
  } catch (error) {
    console.error('Error during API call:', error);
    return null;
  }
}

// Main test function
async function runTest() {
  console.log('Starting packing button API test');
  
  // First, check the current status
  try {
    const response = await fetch(`http://localhost:5000/api/warehouse/packing-tasks/${taskId}`);
    const task = await response.json();
    console.log('Initial task status:', task.status);
    
    if (task.status !== 'pending') {
      console.log(`Task ${taskId} is not in pending state. Current state: ${task.status}`);
      
      // Try to find a pending task
      const tasksResponse = await fetch('http://localhost:5000/api/warehouse/packing-tasks');
      const tasks = await tasksResponse.json();
      
      const pendingTask = tasks.find(t => t.status === 'pending');
      
      if (pendingTask) {
        console.log(`Found pending task with ID: ${pendingTask.id}`);
        await startPackingTask(pendingTask.id);
      } else {
        console.log('No pending tasks found.');
      }
    } else {
      // Task is pending, proceed with test
      await startPackingTask(taskId);
    }
  } catch (error) {
    console.error('Error checking task status:', error);
  }
}

// Run the test
runTest();