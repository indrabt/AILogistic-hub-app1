/**
 * Warehouse Packing Complete Task Test
 * 
 * This test verifies that the "Complete" button works correctly after starting a task,
 * ensuring that a task can be fully processed through the workflow.
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

test('Complete button works after starting a task', async ({ page }) => {
  // Enable more verbose logging for debugging
  page.on('console', msg => {
    console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
  });
  
  // Login as warehouse staff
  await loginAsWarehouseStaff(page);
  
  // Navigate to the warehouse packing page
  await page.goto('/warehouse-packing');
  
  // Wait for the page to load fully
  await page.waitForSelector('h1:has-text("Warehouse Packing")');
  
  console.log('Setting test verification bypass flags');
  // Set session storage to bypass verifications for testing
  await page.evaluate(() => {
    window.sessionStorage.setItem('bypassPackingVerification', 'true');
    window.sessionStorage.setItem('bypassPackingScanVerification', 'true');
  });
  
  // Find a pending task
  const pendingTaskRow = await page.locator('table tbody tr').filter({ 
    has: page.locator('td:has-text("pending")') 
  }).first();
  
  // If no pending tasks, the test can't proceed
  if (await pendingTaskRow.count() === 0) {
    console.log('No pending tasks available for testing');
    test.fail(/* message */ 'No pending tasks available for testing');
    return;
  }
  
  // Get the task ID and initial status
  const taskId = await pendingTaskRow.locator('td').first().textContent();
  console.log(`Testing with task ID: ${taskId}`);
  const initialStatus = await pendingTaskRow.locator('td:nth-child(5)').textContent();
  console.log(`Initial task status: ${initialStatus}`);
  
  // Click the "Start Packing" button
  await pendingTaskRow.locator('button:has-text("Start Packing")').click();
  
  // Verify the row UI updates to show "in_progress" status
  // We'll look for either status text or continue button
  await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("in_progress")`, { timeout: 5000 });
  await page.waitForSelector(`table tbody tr:has-text("${taskId}") button:has-text("Continue")`, { timeout: 5000 });
  
  console.log('Task successfully started, now testing Complete button');
  
  // Now locate the same row after it's been updated to in_progress
  const inProgressRow = await page.locator('table tbody tr').filter({
    has: page.locator(`td >> text="${taskId}"`)
  }).first();
  
  // Verify the status text is now "in_progress"
  const midStatus = await inProgressRow.locator('td:nth-child(5)').textContent();
  console.log(`Task status after starting: ${midStatus}`);
  expect(midStatus?.trim().toLowerCase()).toBe('in_progress');
  
  // Find and click the "Complete" button in the row
  const completeButton = await inProgressRow.locator('button:has-text("Complete")');
  expect(await completeButton.isVisible()).toBe(true);
  
  // Take a screenshot before clicking Complete
  await page.screenshot({ path: 'before-complete-click.png' });
  
  // Click the Complete button
  console.log('Clicking Complete button');
  await completeButton.click();
  
  // Wait for the status to update to "completed"
  await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("completed")`, { timeout: 5000 });
  
  // Take a screenshot after completion
  await page.screenshot({ path: 'after-complete-click.png' });
  
  // Verify the status has changed to completed
  const finalStatus = await page.locator(`table tbody tr:has-text("${taskId}") td:nth-child(5)`).textContent();
  console.log(`Final task status: ${finalStatus}`);
  expect(finalStatus?.trim().toLowerCase()).toBe('completed');
  
  // Verify the Complete button is gone and replaced with View Details
  const viewDetailsButton = await page.locator(`table tbody tr:has-text("${taskId}") button:has-text("View Details")`);
  expect(await viewDetailsButton.isVisible()).toBe(true);
  
  console.log('Test complete - task successfully started and completed');
});

test('Complete task from detail view works', async ({ page }) => {
  // Enable more verbose logging for debugging
  page.on('console', msg => {
    console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
  });
  
  // Login as warehouse staff
  await loginAsWarehouseStaff(page);
  
  // Navigate to the warehouse packing page
  await page.goto('/warehouse-packing');
  
  // Wait for the page to load fully
  await page.waitForSelector('h1:has-text("Warehouse Packing")');
  
  console.log('Setting test verification bypass flags');
  // Set session storage to bypass verifications for testing
  await page.evaluate(() => {
    window.sessionStorage.setItem('bypassPackingVerification', 'true');
    window.sessionStorage.setItem('bypassPackingScanVerification', 'true');
  });
  
  // Find a pending task
  const pendingTaskRow = await page.locator('table tbody tr').filter({ 
    has: page.locator('td:has-text("pending")') 
  }).first();
  
  // If no pending tasks, try to find an in-progress task
  if (await pendingTaskRow.count() === 0) {
    console.log('No pending tasks found, looking for in-progress tasks');
    const inProgressTask = await page.locator('table tbody tr').filter({ 
      has: page.locator('td:has-text("in_progress")') 
    }).first();
    
    if (await inProgressTask.count() === 0) {
      console.log('No in-progress tasks available for testing');
      test.fail(/* message */ 'No pending or in-progress tasks available for testing');
      return;
    }
    
    // Click on Continue for this task
    await inProgressTask.locator('button:has-text("Continue")').click();
  } else {
    // Start the pending task
    await pendingTaskRow.locator('button:has-text("Start Packing")').click();
    
    // Get the task ID 
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    
    // Wait for the task to be in progress
    await page.waitForSelector(`table tbody tr:has-text("${taskId}") td:has-text("in_progress")`, { timeout: 5000 });
    
    // Now click on the Continue button to go to the detail view
    await page.locator(`table tbody tr:has-text("${taskId}") button:has-text("Continue")`).click();
  }
  
  // Wait for the detail view to appear
  await page.waitForSelector('h2:has-text("Packing Task #")');
  
  // Take a screenshot before clicking Complete
  await page.screenshot({ path: 'before-detail-complete.png' });
  
  // Find and click the Complete Task button in the detail view
  const detailCompleteButton = await page.locator('button:has-text("Complete Task")');
  expect(await detailCompleteButton.isVisible()).toBe(true);
  
  console.log('Clicking Complete Task button in detail view');
  await detailCompleteButton.click();
  
  // The UI should go back to the task list
  await page.waitForSelector('table tbody tr');
  
  // Take a screenshot after completion
  await page.screenshot({ path: 'after-detail-complete.png' });
  
  // Verify that we're back at the task list and no longer in detail view
  const isDetailViewClosed = await page.locator('h2:has-text("Packing Task #")').count() === 0;
  expect(isDetailViewClosed).toBe(true);
  
  console.log('Test complete - task successfully completed from detail view');
});