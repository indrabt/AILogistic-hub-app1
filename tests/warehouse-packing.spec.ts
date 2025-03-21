import { test, expect } from '@playwright/test';
import { storeTestData, retrieveTestData } from './helpers/test-memory';

/**
 * Warehouse Packing UI Tests
 * 
 * These tests verify that the warehouse packing UI works correctly,
 * focusing on interaction with packing tasks, items, and the package creation process.
 */

test.describe('Warehouse Packing Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to warehouse packing page
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
    
    // Navigate to packing page
    await page.click('text=Packing');
    await page.waitForURL('/warehouse-packing');
  });

  test('should display pending packing tasks in the table', async ({ page }) => {
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
    await expect(headers.nth(5)).toHaveText('Status');
  });

  test('should be able to start a pending packing task', async ({ page }) => {
    // Find a pending task in the table
    const pendingTaskRow = page.locator('table tbody tr').filter({
      has: page.locator('button', { hasText: 'Start Packing' })
    }).first();
    
    // Verify if we have a pending task
    const pendingTaskCount = await pendingTaskRow.count();
    if (pendingTaskCount === 0) {
      console.log('No pending packing tasks available');
      return;
    }
    
    // Get the task ID for verification later
    const taskId = await pendingTaskRow.locator('td').first().textContent();
    
    // Click "Start Packing" button on a pending task
    await pendingTaskRow.locator('button', { hasText: 'Start Packing' }).click();
    
    // Verify that the task details are displayed
    const taskDetailsCard = page.locator('h2', { hasText: `Task #${taskId} Details` }).first();
    await expect(taskDetailsCard).toBeVisible();
    
    // Verify the task status has changed in the UI
    await expect(pendingTaskRow.locator('td').nth(5)).toContainText('in progress');
    
    // Store task information for future tests
    await storeTestData(page, 'packingTaskUnderTest', {
      id: taskId,
      status: 'in_progress'
    }, { persistToFile: true });
  });

  test('should be able to create a new package', async ({ page }) => {
    // Try to retrieve task from previous test
    const taskInfo = await retrieveTestData<{ id: string, status: string }>(page, 'packingTaskUnderTest', { fallbackToFile: true });
    
    // If we don't have stored task info, find an in-progress task
    let taskId: string;
    if (!taskInfo) {
      // Find a task in progress
      const inProgressTaskRow = page.locator('table tbody tr').filter({
        has: page.locator('td:has-text("in progress")')
      }).first();
      
      // Verify if we have an in-progress task
      const inProgressTaskCount = await inProgressTaskRow.count();
      if (inProgressTaskCount === 0) {
        console.log('No in-progress packing tasks available');
        return;
      }
      
      // Get the task ID
      taskId = (await inProgressTaskRow.locator('td').first().textContent()) || '';
      
      // Click "View Details" to see the task items
      await inProgressTaskRow.locator('button', { hasText: 'View Details' }).click();
    } else {
      taskId = taskInfo.id;
      
      // Find the task in the UI
      const taskRow = page.locator('table tbody tr').filter({
        has: page.locator(`td:has-text("${taskId}")`)
      }).first();
      
      // Click "View Details" to see the task items
      await taskRow.locator('button', { hasText: /View Details|Continue/ }).click();
    }
    
    // Wait for the task details to load
    await page.waitForSelector(`h2:has-text("Task #${taskId} Details")`);
    
    // Click "Create New Package" button
    await page.click('button:has-text("Create New Package")');
    
    // Wait for the package creation dialog
    await expect(page.locator('.dialog-title, .modal-title')).toContainText('Create New Package');
    
    // Fill package details
    await page.fill('input[name="packageType"]', 'Box');
    await page.fill('input[name="length"]', '30');
    await page.fill('input[name="width"]', '20');
    await page.fill('input[name="height"]', '15');
    await page.fill('input[name="weight"]', '2.5');
    
    // Submit the form
    await page.click('button:has-text("Create Package")');
    
    // Verify the package was created
    await expect(page.locator('h3:has-text("Packages")')).toBeVisible();
    await expect(page.locator('text=Box')).toBeVisible();
    
    // Store package information for future tests
    await storeTestData(page, 'createdPackage', {
      taskId: taskId,
      type: 'Box',
      dimensions: '30 × 20 × 15 cm',
      weight: '2.5 kg'
    }, { persistToFile: true });
  });

  test('should be able to pack items into a package', async ({ page }) => {
    // Try to retrieve task and package from previous tests
    const taskInfo = await retrieveTestData<{ id: string, status: string }>(page, 'packingTaskUnderTest', { fallbackToFile: true });
    const packageInfo = await retrieveTestData<{ taskId: string, type: string }>(page, 'createdPackage', { fallbackToFile: true });
    
    // Skip if we don't have the necessary information
    if (!taskInfo || !packageInfo || taskInfo.id !== packageInfo.taskId) {
      console.log('Missing task or package information from previous tests');
      return;
    }
    
    // Find the task in the UI
    const taskRow = page.locator('table tbody tr').filter({
      has: page.locator(`td:has-text("${taskInfo.id}")`)
    }).first();
    
    // Click "View Details" or "Continue" to see the task items
    await taskRow.locator('button', { hasText: /View Details|Continue/ }).click();
    
    // Wait for the task details to load
    await page.waitForSelector('h2', { hasText: `Task #${taskInfo.id} Details` });
    
    // Find an unpacked item
    const unpackedItemRow = page.locator('table:has-text("Items") tbody tr').filter({
      has: page.locator('td:has-text("pending")')
    }).first();
    
    // Verify if we have an unpacked item
    const unpackedItemCount = await unpackedItemRow.count();
    if (unpackedItemCount === 0) {
      console.log('No unpacked items available');
      return;
    }
    
    // Get the item name for verification
    const itemName = await unpackedItemRow.locator('td').nth(1).textContent();
    
    // Click "Pack" button on the item
    await unpackedItemRow.locator('button', { hasText: "Pack" }).click();
    
    // Wait for the packing dialog
    await expect(page.locator('.dialog-title, .modal-title')).toContainText('Pack Item');
    
    // Select the package (if there are multiple packages)
    const packageSelector = page.locator('select[name="packageId"]');
    if (await packageSelector.count() > 0) {
      await packageSelector.selectOption({ label: packageInfo.type });
    }
    
    // Input packed quantity (use the default quantity)
    
    // Submit the form
    await page.click('button:has-text("Confirm")');
    
    // Verify the item was packed
    await expect(unpackedItemRow.locator('td').nth(4)).toContainText('packed');
    
    // Store item information for future tests
    await storeTestData(page, 'packedItem', {
      taskId: taskInfo.id,
      name: itemName,
      status: 'packed'
    }, { persistToFile: true });
  });

  test('should be able to complete a packing task', async ({ page }) => {
    // Try to retrieve task from previous tests
    const taskInfo = await retrieveTestData<{ id: string, status: string }>(page, 'packingTaskUnderTest', { fallbackToFile: true });
    
    // Skip if we don't have the necessary information
    if (!taskInfo) {
      console.log('Missing task information from previous tests');
      return;
    }
    
    // Find the task in the UI
    const taskRow = page.locator('table tbody tr').filter({
      has: page.locator(`td:has-text("${taskInfo.id}")`)
    }).first();
    
    // If task is not found, skip the test
    const taskRowCount = await taskRow.count();
    if (taskRowCount === 0) {
      console.log(`Task #${taskInfo.id} not found`);
      return;
    }
    
    // Click "View Details" or "Continue" to see the task items
    await taskRow.locator('button', { hasText: /View Details|Continue/ }).click();
    
    // Wait for the task details to load
    await page.waitForSelector('h2', { hasText: `Task #${taskInfo.id} Details` });
    
    // Check for unpacked items
    const unpackedItemCount = await page.locator('table:has-text("Items") tbody tr').filter({
      has: page.locator('td:has-text("pending")')
    }).count();
    
    // Pack all unpacked items if needed
    if (unpackedItemCount > 0) {
      // First ensure we have a package
      const packagesCount = await page.locator('h3:has-text("Packages")').count();
      if (packagesCount === 0) {
        // Create a package if none exists
        await page.click('button:has-text("Create New Package")');
        await page.fill('input[name="packageType"]', 'Box');
        await page.fill('input[name="length"]', '30');
        await page.fill('input[name="width"]', '20');
        await page.fill('input[name="height"]', '15');
        await page.fill('input[name="weight"]', '2.5');
        await page.click('button:has-text("Create Package")');
      }
      
      // Pack each unpacked item
      for (let i = 0; i < unpackedItemCount; i++) {
        const unpackedItem = page.locator('table:has-text("Items") tbody tr').filter({
          has: page.locator('td:has-text("pending")')
        }).first();
        
        await unpackedItem.locator('button', { hasText: "Pack" }).click();
        await page.click('button:has-text("Confirm")');
        
        // Wait a bit for the UI to update
        await page.waitForTimeout(500);
      }
    }
    
    // Now complete the task
    await page.click('button:has-text("Complete Task")');
    
    // Verify the task is completed
    await expect(page.locator('h1')).toContainText('Packing Tasks');
    
    // Find the task in the table again
    const completedTaskRow = page.locator('table tbody tr').filter({
      has: page.locator(`td:has-text("${taskInfo.id}")`)
    }).first();
    
    // Verify the task status has changed to "completed"
    await expect(completedTaskRow.locator('td').nth(5)).toContainText('completed');
    
    // Update task information in storage
    await storeTestData(page, 'packingTaskUnderTest', {
      id: taskInfo.id,
      status: 'completed'
    }, { persistToFile: true });
  });
});