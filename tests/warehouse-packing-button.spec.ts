/**
 * Warehouse Packing Button Test
 * 
 * This test specifically focuses on verifying the "Start Packing" button functionality,
 * testing that clicking the button correctly changes the task status in both the UI and backend.
 */

import { test, expect } from '@playwright/test';

// Helper function to login as warehouse staff
async function loginAsWarehouseStaff(page) {
  // Go to login page
  await page.goto('/login');
  
  // Fill in warehouse staff credentials
  await page.fill('input[name="username"]', 'warehouse1');
  await page.fill('input[name="password"]', 'password');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete
  await page.waitForURL('/warehouse-dashboard');
  
  // Verify we've logged in successfully
  const welcomeText = await page.textContent('h1');
  expect(welcomeText).toContain('Warehouse');
}

// Store initial task status for comparison
let initialTaskStatus: string | null = null;

test('Start Packing button changes task status', async ({ page }) => {
  // Login as warehouse staff
  await loginAsWarehouseStaff(page);
  
  // Navigate to the warehouse packing page
  await page.goto('/warehouse-packing');
  
  // Wait for the page to load fully
  await page.waitForSelector('h1:has-text("Warehouse Packing")');
  
  // Verify we're on the packing page
  const pageTitle = await page.textContent('h1');
  expect(pageTitle).toBe('Warehouse Packing');

  // Wait for tasks to load
  await page.waitForSelector('table tbody tr');

  // Save console logs to check API responses
  page.on('console', msg => {
    console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
  });
  
  // Find a task with "pending" status
  const pendingTaskRow = await page.locator('table tbody tr').filter({ 
    has: page.locator('td:has-text("pending")') 
  }).first();
  
  // Get the task ID for later reference
  const taskId = await pendingTaskRow.locator('td').first().textContent();
  console.log(`Testing with task ID: ${taskId}`);
  
  // Store the initial status
  initialTaskStatus = await pendingTaskRow.locator('td:nth-child(5)').textContent();
  console.log(`Initial task status: ${initialTaskStatus}`);
  
  // Make sure task is pending before we start
  expect(initialTaskStatus?.trim().toLowerCase()).toBe('pending');
  
  // Find and click the "Start Packing" button for this task
  const startButton = pendingTaskRow.locator('button:has-text("Start Packing")');
  
  // Check that button is visible and enabled
  await expect(startButton).toBeVisible();
  await expect(startButton).toBeEnabled();
  
  // Click the button
  console.log('Clicking "Start Packing" button');
  await startButton.click();
  
  // Wait for the status to change in the UI (might take a moment)
  // Check for either the status badge changing or the button changing to "Continue"
  try {
    // Wait for the status badge to change (first approach)
    await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("in_progress")`, {
      timeout: 5000
    });
    
    // Wait for the "Continue" button to appear (alternative approach)
    await page.waitForSelector(`table tbody tr:has-text("${taskId}") button:has-text("Continue")`, {
      timeout: 5000
    });
    
    // Get the updated status from the UI
    const updatedStatus = await page.locator(`table tbody tr:has-text("${taskId}") td:nth-child(5)`).textContent();
    console.log(`Updated task status in UI: ${updatedStatus}`);
    
    // Verify the status changed to "in_progress"
    expect(updatedStatus?.trim().toLowerCase()).toBe('in_progress');
    
    console.log('Test passed: Task status successfully changed to in_progress');
  } catch (e) {
    console.error('Error waiting for status change:', e);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-failure-packing-button.png' });
    
    // Check if we see any buttons - this helps debug visibility issues
    const buttons = await page.locator('button').count();
    console.log(`Total buttons on page: ${buttons}`);
    
    // Check via console.log what the API response was
    console.log('Directly checking current task status...');
    
    // Verify status directly with the API
    const status = await page.evaluate(async (id) => {
      const response = await fetch(`/api/warehouse/packing-tasks/${id}`);
      const task = await response.json();
      return { 
        id: task.id,
        status: task.status,
        assignedTo: task.assignedTo
      };
    }, taskId);
    
    console.log('Current task status from API:', status);
    
    // Even if the UI didn't update, the API status should have changed
    expect(status.status).toBe('in_progress');
    
    // Fail the test if we got here
    throw new Error('Task status did not update in the UI within timeout period');
  }
});

test('Packing task can be completed', async ({ page }) => {
  // Login as warehouse staff
  await loginAsWarehouseStaff(page);
  
  // Navigate to the warehouse packing page
  await page.goto('/warehouse-packing');
  
  // Wait for the page to load fully
  await page.waitForSelector('h1:has-text("Warehouse Packing")');
  
  // Set session storage to bypass verifications for testing
  await page.evaluate(() => {
    window.sessionStorage.setItem('bypassPackingVerification', 'true');
    window.sessionStorage.setItem('bypassPackingScanVerification', 'true');
  });
  
  // Find a task with "in_progress" status
  const inProgressTaskRow = await page.locator('table tbody tr').filter({ 
    has: page.locator('td:has-text("in_progress")') 
  }).first();
  
  // If there are no in-progress tasks, we need to start one
  if (await inProgressTaskRow.count() === 0) {
    console.log('No in-progress tasks found. Starting a pending task first.');
    
    // Find and click the "Start Packing" button for a pending task
    const pendingTaskRow = await page.locator('table tbody tr').filter({ 
      has: page.locator('td:has-text("pending")') 
    }).first();
    
    if (await pendingTaskRow.count() === 0) {
      throw new Error('No pending tasks available to test with');
    }
    
    // Get task ID
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    console.log(`Starting task ID: ${taskId} for completion test`);
    
    // Click Start Packing
    await pendingTaskRow.locator('button:has-text("Start Packing")').click();
    
    // Wait for task to show as in_progress
    await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("in_progress")`, {
      timeout: 5000
    });
  }
  
  // Now get the in-progress task row again (could be the same or a newly started one)
  const taskRow = await page.locator('table tbody tr').filter({ 
    has: page.locator('td:has-text("in_progress")') 
  }).first();
  
  // Get the task ID
  const taskId = await taskRow.locator('td').first().textContent();
  console.log(`Testing completion with task ID: ${taskId}`);
  
  // Click the "Continue" button to open the task details
  await taskRow.locator('button:has-text("Continue")').click();
  
  // Wait for the task details to appear
  await page.waitForSelector(`h2:has-text("Packing Task #${taskId}")`);
  
  // Click the "Complete Task" button
  await page.locator('button:has-text("Complete Task")').click();
  
  // Wait for the status to change to completed
  await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("completed")`, {
    timeout: 5000
  });
  
  // Verify the task status is now "completed"
  const finalStatus = await page.locator(`table tbody tr:has-text("${taskId}") td:nth-child(5)`).textContent();
  expect(finalStatus?.trim().toLowerCase()).toBe('completed');
  
  console.log('Test passed: Task successfully completed');
});