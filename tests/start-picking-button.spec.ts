import { test, expect } from '@playwright/test';

/**
 * Start Picking Button Test
 * 
 * This test specifically focuses on verifying the "Start Picking" button functionality,
 * testing that clicking the button correctly changes the task status in both the UI and backend.
 */

test.describe('Start Picking Button Functionality', () => {
  // Before each test, login and navigate to warehouse picking page
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto('/');
    
    // Login as warehouse staff
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Verify successful login by checking URL
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to picking page
    await page.click('text=Picking');
    await page.waitForURL('/warehouse-picking');
  });

  test('should successfully start a pending pick task', async ({ page }) => {
    // Wait for the tasks table to load
    await page.waitForSelector('table');
    
    // Find a pending task in the table (one with a "Start Picking" button)
    const pendingTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'Start Picking' })
    }).first();
    
    // Skip test if no pending tasks are available
    const hasPendingTask = await pendingTaskRow.count() > 0;
    if (!hasPendingTask) {
      console.log('No pending tasks available for testing. Skipping test.');
      test.skip();
      return;
    }
    
    // Get the task ID and initial status for verification
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    const initialStatus = await pendingTaskRow.locator('td').nth(5).textContent();
    
    console.log(`Testing Start Picking button on Task ID: ${taskId}, Initial Status: ${initialStatus}`);
    
    // Click the "Start Picking" button
    await pendingTaskRow.locator('button', { hasText: 'Start Picking' }).click();
    
    // Wait for the toast notification confirming task start
    await expect(page.locator('.toast-title')).toContainText('Task Started', { timeout: 5000 });
    
    // Verify that the task details view is displayed
    const taskDetailsHeading = page.locator('h2', { hasText: `Task #${taskId} Details` });
    await expect(taskDetailsHeading).toBeVisible();
    
    // Verify the task status has changed in the UI
    const updatedStatus = await pendingTaskRow.locator('td').nth(5).textContent();
    expect(updatedStatus?.trim().toLowerCase()).toBe('in progress');
    
    console.log(`Task status change verified in UI: ${initialStatus} -> ${updatedStatus}`);
    
    // Verify the status was changed in the backend by making a direct API call
    const apiResponse = await page.evaluate(async (id: string) => {
      try {
        const response = await fetch(`/api/warehouse/pick-tasks/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          return { success: false, error: `API responded with status ${response.status}` };
        }
        
        const task = await response.json();
        return { success: true, task };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }, taskId);
    
    // Verify the API response shows the task as "in_progress"
    expect(apiResponse.success).toBe(true);
    
    // Type assertion to help TypeScript know the structure
    if (apiResponse.success && apiResponse.task) {
      const task = apiResponse.task as { status: string };
      expect(task.status).toBe('in_progress');
      console.log(`Task status change verified in backend API: ${task.status}`);
    }
  });

  test('should not show Start Picking button for tasks already in progress', async ({ page }) => {
    // Wait for the tasks table to load
    await page.waitForSelector('table');
    
    // Find an in-progress task
    const inProgressTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('td', { hasText: 'in progress' })
    }).first();
    
    // Skip test if no in-progress tasks are available
    const hasInProgressTask = await inProgressTaskRow.count() > 0;
    if (!hasInProgressTask) {
      console.log('No in-progress tasks available for testing. Skipping test.');
      test.skip();
      return;
    }
    
    // Get the task ID for verification
    const taskId = await inProgressTaskRow.locator('td').first().textContent();
    console.log(`Checking in-progress Task ID: ${taskId}`);
    
    // Verify that there is no "Start Picking" button for this task
    const startPickingButton = inProgressTaskRow.locator('button', { hasText: 'Start Picking' });
    expect(await startPickingButton.count()).toBe(0);
    
    // Verify that there is a "View Details" button instead
    const viewDetailsButton = inProgressTaskRow.locator('button', { hasText: 'View Details' });
    expect(await viewDetailsButton.count()).toBe(1);
    
    console.log('Verified in-progress task does not have a Start Picking button');
  });
});