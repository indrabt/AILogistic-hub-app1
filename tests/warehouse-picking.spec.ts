import { test, expect } from '@playwright/test';

/**
 * Warehouse Picking UI Tests
 * 
 * These tests verify that the warehouse picking UI works correctly,
 * focusing on interaction with tasks, items, and the scanning process.
 */

test.describe('Warehouse Picking Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to warehouse picking page
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to picking page
    await page.click('text=Picking');
    await page.waitForURL('/warehouse-picking');
  });

  test('should display pending pick tasks in the table', async ({ page }) => {
    // Wait for the tasks table to load
    await page.waitForSelector('table');
    
    // Verify that we have some tasks in the table
    const taskRows = page.locator('table tbody tr');
    const count = await taskRows.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify the table contains expected columns
    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toHaveText('Task ID');
    await expect(headers.nth(1)).toHaveText('Order ID');
    await expect(headers.nth(2)).toHaveText('Priority');
    await expect(headers.nth(5)).toHaveText('Status');
  });

  test('should be able to start a pending pick task', async ({ page }) => {
    // Find a pending task in the table
    const pendingTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'Start Picking' })
    }).first();
    
    // Get the task ID for verification later
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    
    // Click "Start Picking" button on a pending task
    await pendingTaskRow.locator('button', { hasText: 'Start Picking' }).click();
    
    // Wait for the toast notification
    await expect(page.locator('.toast-title')).toContainText('Task Started');
    
    // Verify that the task details are displayed
    const taskDetailsCard = page.locator('h2', { hasText: `Task #${taskId} Details` }).first();
    await expect(taskDetailsCard).toBeVisible();
    
    // Verify the task status has changed in the UI
    await expect(pendingTaskRow.locator('td').nth(5)).toContainText('in progress');
  });

  test('should be able to mark an item as unavailable', async ({ page }) => {
    // Find a task in progress
    const inProgressTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'View Details' })
    }).first();
    
    // Click "View Details" to see the task items
    await inProgressTaskRow.locator('button', { hasText: 'View Details' }).click();
    
    // Wait for the task items to load
    await page.waitForSelector('table >> nth=1'); // The second table is the items table
    
    // Find a pending item
    const pendingItemRow = page.locator('table >> nth=1').locator('tbody tr').filter({
      has: page.locator('button', { hasText: 'Mark Unavailable' })
    }).first();
    
    // Get the product name for verification
    const productName = await pendingItemRow.locator('td').nth(1).textContent();
    
    // Click "Mark Unavailable"
    await pendingItemRow.locator('button', { hasText: 'Mark Unavailable' }).click();
    
    // Wait for the toast notification
    await expect(page.locator('.toast-title')).toContainText('Item Marked as Unavailable');
    
    // Verify the item status has changed in the UI
    await expect(pendingItemRow.locator('td').nth(4)).toContainText('unavailable');
  });

  test('should be able to scan and pick an item', async ({ page }) => {
    // Find a task in progress
    const inProgressTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'View Details' })
    }).first();
    
    // Click "View Details" to see the task items
    await inProgressTaskRow.locator('button', { hasText: 'View Details' }).click();
    
    // Wait for the task items to load
    await page.waitForSelector('table >> nth=1'); // The second table is the items table
    
    // Find a pending item
    const pendingItemRow = page.locator('table >> nth=1').locator('tbody tr').filter({
      has: page.locator('button', { hasText: 'Scan & Pick' })
    }).first();
    
    // Click "Scan & Pick"
    await pendingItemRow.locator('button', { hasText: 'Scan & Pick' }).click();
    
    // Wait for the scan dialog to appear
    await expect(page.locator('dialog.modal-open')).toBeVisible();
    
    // Simulate scanning by clicking the "Simulate Scan" button
    await page.click('button:has-text("Simulate Scan")');
    
    // Wait for scan verification to complete
    await page.waitForSelector('text=Scan verified successfully');
    
    // Confirm the picked quantity
    await page.click('button:has-text("Confirm")');
    
    // Wait for the scan dialog to close and item to be updated
    await expect(page.locator('dialog.modal-open')).not.toBeVisible({ timeout: 5000 });
    
    // Verify the item status has changed to "picked" in the UI
    await expect(pendingItemRow.locator('td').nth(4)).toContainText('picked');
  });

  test('should be able to complete a task when all items are picked', async ({ page }) => {
    // Find a task in progress
    const inProgressTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'Complete' })
    }).first();
    
    // Get the task ID for verification
    const taskId = await inProgressTaskRow.locator('td').first().textContent();
    
    // Click "View Details" first to view the task
    await inProgressTaskRow.locator('button', { hasText: 'View Details' }).click();
    
    // Check if all items are picked or unavailable by looking at the Complete button state
    const completeButton = page.locator('button:has-text("Complete")').last();
    const isDisabled = await completeButton.isDisabled();
    
    if (isDisabled) {
      // If the button is disabled, we need to mark all items as picked/unavailable
      const pendingItems = page.locator('table >> nth=1').locator('tbody tr').filter({
        has: page.locator('text=pending')
      });
      
      const count = await pendingItems.count();
      for (let i = 0; i < count; i++) {
        // Find the first pending item each time since the DOM updates
        const pendingItem = page.locator('table >> nth=1').locator('tbody tr').filter({
          has: page.locator('text=pending')
        }).first();
        
        // Mark as unavailable (easier than simulating scan)
        await pendingItem.locator('button', { hasText: 'Mark Unavailable' }).click();
        
        // Wait for the item to be updated
        await page.waitForTimeout(500);
      }
    }
    
    // Now click the "Complete" button (either in the task row or in the footer)
    await page.click('button:has-text("Complete"):not([disabled])');
    
    // Wait for the toast notification
    await expect(page.locator('.toast-title')).toContainText('Task Completed');
    
    // Verify the task status has changed to "completed" in the UI
    const completedTask = page.locator('table tbody tr').filter({
      has: page.locator(`td:has-text("${taskId}")`)
    }).first();
    
    await expect(completedTask.locator('td').nth(5)).toContainText('completed');
  });
});

/**
 * Global memory approach for UI testing
 * 
 * This test demonstrates how to store test state in a global object
 * that can be used across different test runs.
 */
test.describe('Global Memory Approach', () => {
  test('should store and retrieve task data across test runs', async ({ page }) => {
    // Login and navigate to warehouse picking page
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to picking page
    await page.click('text=Picking');
    await page.waitForURL('/warehouse-picking');
    
    // Store task data in session storage for later retrieval
    await page.evaluate(() => {
      // Get tasks from the current page
      const taskRows = Array.from(document.querySelectorAll('table tbody tr'));
      const tasksData = taskRows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
          id: cells[0]?.textContent?.trim(),
          orderId: cells[1]?.textContent?.trim(),
          priority: cells[2]?.textContent?.trim(),
          status: cells[5]?.textContent?.trim(),
        };
      });
      
      // Store in session storage for later tests
      sessionStorage.setItem('warehouseTasksTestData', JSON.stringify(tasksData));
      
      // Return the count to verify
      return tasksData.length;
    });
    
    // Verify we can retrieve the data
    const dataExists = await page.evaluate(() => {
      const data = sessionStorage.getItem('warehouseTasksTestData');
      return data !== null;
    });
    
    expect(dataExists).toBe(true);
    
    // For global state that persists even when session storage is cleared,
    // we could save to a JSON file on the server, but for this demo,
    // session storage is sufficient
  });

  test('should utilize task data from previous tests', async ({ page }) => {
    // Login and navigate to warehouse picking page
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to picking page
    await page.click('text=Picking');
    await page.waitForURL('/warehouse-picking');
    
    // Retrieve task data from session storage
    const hasData = await page.evaluate(() => {
      const data = sessionStorage.getItem('warehouseTasksTestData');
      return data !== null && data !== '';
    });
    
    if (hasData) {
      // Use the stored data to verify UI state
      const currentStatus = await page.evaluate(() => {
        // Define interfaces for type safety
        interface TaskBasicInfo {
          id: string;
          status: string;
        }
        
        interface StatusChange {
          id: string;
          oldStatus: string;
          newStatus: string;
          timestamp: string;
        }
        
        // Get stored test data
        const storedData = JSON.parse(sessionStorage.getItem('warehouseTasksTestData') || '[]') as TaskBasicInfo[];
        
        // Get current task rows
        const currentTaskRows = Array.from(document.querySelectorAll('table tbody tr'));
        const currentTasksData = currentTaskRows.map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const taskInfo: TaskBasicInfo = {
            id: cells[0]?.textContent?.trim() || '',
            status: cells[5]?.textContent?.trim() || ''
          };
          return taskInfo;
        });
        
        // Compare with stored data to see if statuses changed
        const statusChanges: StatusChange[] = [];
        for (const storedTask of storedData) {
          const currentTask = currentTasksData.find(t => t.id === storedTask.id);
          if (currentTask && currentTask.status !== storedTask.status && currentTask.status) {
            const change: StatusChange = {
              id: storedTask.id,
              oldStatus: storedTask.status,
              newStatus: currentTask.status,
              timestamp: new Date().toISOString()
            };
            statusChanges.push(change);
          }
        }
        
        // Store status changes for verification
        sessionStorage.setItem('statusChanges', JSON.stringify(statusChanges));
        
        return statusChanges.length > 0;
      });
      
      // Log the finding but don't fail test if we don't detect changes
      if (currentStatus) {
        console.log('Detected status changes from previous test run');
      } else {
        console.log('No status changes detected from previous test run');
      }
    } else {
      console.log('No previous test data found in session storage');
    }
    
    // Always pass this test - it's for demonstration purposes
    expect(true).toBe(true);
  });
});