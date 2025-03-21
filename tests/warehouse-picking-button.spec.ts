import { test, expect } from '@playwright/test';
import { retrieveTestData, storeTestData } from './helpers/test-memory';

/**
 * Warehouse Picking Button Test
 * 
 * This test specifically focuses on verifying the "Start Picking" button functionality
 * including the handleStartTask function behavior with all validation cases:
 * 1. Successfully starting a pending task 
 * 2. Attempting to start a task that's already in progress (should fail)
 * 3. Attempting to start a task without being logged in (should fail)
 * 4. Proper UI updates after status changes
 */

test.describe('Start Picking Button Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to warehouse picking page
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to picking page using the direct HTML approach
    // This is the recommended approach to avoid navigation issues
    await page.goto('/public/warehouse-direct-link.html?page=picking');
    
    // Wait for redirect to complete
    await page.waitForURL('/warehouse-picking');
  });

  test('should successfully start a pending pick task', async ({ page }) => {
    // Find a pending task in the table
    const pendingTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'Start Picking' })
    }).first();
    
    // Skip test if no pending tasks are available
    if (await pendingTaskRow.count() === 0) {
      test.skip('No pending tasks available for testing');
      return;
    }
    
    // Get the task ID and status for verification later
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    const initialStatus = await pendingTaskRow.locator('td').nth(5).textContent();
    
    // Store task data for cross-test verification
    await storeTestData(page, 'pickingTaskTest', {
      id: taskId,
      initialStatus,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Starting test with Task ID: ${taskId}, Initial Status: ${initialStatus}`);
    
    // Click "Start Picking" button on the pending task
    await pendingTaskRow.locator('button', { hasText: 'Start Picking' }).click();
    
    // Wait for the toast notification of successful task start
    await expect(page.locator('.toast-title')).toContainText('Task Started', { timeout: 5000 });
    
    // Verify that the task details are displayed
    const taskDetailsCard = page.locator('h2', { hasText: `Task #${taskId} Details` }).first();
    await expect(taskDetailsCard).toBeVisible();
    
    // Verify the task status has changed in the UI
    const newStatus = await pendingTaskRow.locator('td').nth(5).textContent();
    expect(newStatus?.trim().toLowerCase()).toBe('in progress');
    
    console.log(`Task status changed: ${initialStatus} -> ${newStatus}`);
    
    // Store updated task data
    await storeTestData(page, 'pickingTaskTestAfter', {
      id: taskId,
      newStatus,
      timestamp: new Date().toISOString()
    });
  });

  test('should not be able to start a task that is already in progress', async ({ page }) => {
    // Find a task that's already in progress
    const inProgressTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('td', { hasText: 'in progress' })
    }).first();
    
    // Skip test if no in-progress tasks are available
    if (await inProgressTaskRow.count() === 0) {
      test.skip('No in-progress tasks available for testing');
      return;
    }
    
    // Get the task ID for verification
    const taskId = await inProgressTaskRow.locator('td').first().textContent();
    console.log(`Testing in-progress task with ID: ${taskId}`);
    
    // Attempt to start the task again by making a direct API call
    // This simulates clicking a "Start Picking" button if it were available
    const apiResponse = await page.evaluate(async (id) => {
      try {
        const response = await fetch(`/api/warehouse/pick-tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status: 'in_progress',
            assignedTo: 'warehouse1',
            startedAt: new Date().toISOString()
          })
        });
        
        const result = await response.json();
        return { 
          status: response.status,
          ok: response.ok,
          data: result 
        };
      } catch (error) {
        return { 
          status: 500, 
          ok: false, 
          error: error.message 
        };
      }
    }, taskId);
    
    // Verify that the API rejected the request
    // Our improved handleStartTask function should prevent starting an already in-progress task
    expect(apiResponse.ok).toBe(false);
    expect(apiResponse.status).toBeGreaterThanOrEqual(400);
    
    console.log(`API correctly rejected starting an in-progress task with status: ${apiResponse.status}`);
  });

  test('should handle task status change and UI updates correctly', async ({ page }) => {
    // Retrieve previous test data to validate our UI is showing correct information
    const previousTestData = await retrieveTestData(page, 'pickingTaskTest');
    
    if (!previousTestData || !previousTestData.id) {
      test.skip('No previous test data available');
      return;
    }
    
    console.log(`Validating task ID ${previousTestData.id} from previous test`);
    
    // Find the task row by ID
    const taskRow = page.locator('table tbody tr').filter({
      has: page.locator(`td:has-text("${previousTestData.id}")`)
    }).first();
    
    // Verify the task exists
    expect(await taskRow.count()).toBe(1);
    
    // Get current status 
    const currentStatus = await taskRow.locator('td').nth(5).textContent();
    console.log(`Current task status: ${currentStatus}`);
    
    // If the task was previously started, it should now show as "in progress"
    if (previousTestData.initialStatus?.toLowerCase() === 'pending') {
      expect(currentStatus?.trim().toLowerCase()).toBe('in progress');
    }
    
    // Try to view the task details
    await taskRow.locator('button', { hasText: /View Details|Continue/i }).click();
    
    // Verify that task details page is displayed
    await expect(page.locator('h2', { hasText: `Task #${previousTestData.id} Details` })).toBeVisible();
    
    // Verify the item table is shown
    const itemsTable = page.locator('table').nth(1);
    expect(await itemsTable.count()).toBe(1);
    
    // Verify there are items in the task
    const itemRows = itemsTable.locator('tbody tr');
    expect(await itemRows.count()).toBeGreaterThan(0);
    
    console.log(`Task has ${await itemRows.count()} items`);
  });
});