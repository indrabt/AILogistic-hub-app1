import { test, expect } from '@playwright/test';
import { retrieveTestData, storeTestData } from './helpers/test-memory';

/**
 * Warehouse Cycle Count Test
 * 
 * This test verifies the functionality of the cycle count feature,
 * focusing on the navigation approach and task initialization.
 * 
 * It tests:
 * 1. Navigation to cycle count using the direct HTML approach
 * 2. Creating a new cycle count task
 * 3. Viewing and updating cycle count tasks
 */

test.describe('Warehouse Cycle Count Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as warehouse staff
    await page.goto('/');
    await page.fill('[placeholder="Username"]', 'warehouse1');
    await page.fill('[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/warehouse-dashboard');
  });

  test('should navigate to cycle count using direct HTML link', async ({ page }) => {
    // Navigate to cycle count using our new direct HTML approach
    await page.goto('/warehouse-direct-link.html?target=cycle-count');
    
    // Wait for the standalone page to load
    await expect(page.locator('h1', { hasText: 'Cycle Count' })).toBeVisible({ timeout: 10000 });
    
    // Verify the create button is visible
    const createButton = page.locator('button', { hasText: 'Create Cycle Count Task' });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    
    // Store navigation success data
    await storeTestData(page, 'cycleCountNavigation', {
      success: true,
      method: 'direct-html',
      timestamp: new Date().toISOString()
    });
  });

  test('should navigate to cycle count from sidebar', async ({ page }) => {
    // Click on the Cycle Count link in the sidebar
    await page.click('a:has-text("Cycle Count")');
    
    // Wait for the standalone HTML page to load
    await expect(page.locator('h1', { hasText: 'Cycle Count' })).toBeVisible({ timeout: 10000 });
    
    // Verify we're on the standalone page
    const createButton = page.locator('button', { hasText: 'Create Cycle Count Task' });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    
    // Store sidebar navigation success data
    await storeTestData(page, 'cycleCountSidebarNavigation', {
      success: true,
      timestamp: new Date().toISOString()
    });
  });

  test('should navigate to cycle count page', async ({ page }) => {
    // Navigate to cycle count using direct HTML approach
    await page.goto('/warehouse-direct-link.html?target=cycle-count');
    
    // Verify the create button is visible
    const createButton = page.locator('button', { hasText: 'Create Cycle Count Task' });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    
    // Click the create button to go to the main cycle count page
    await createButton.click();
    
    // Verify we reached the cycle count page
    try {
      await page.waitForURL('/cycle-count', { timeout: 10000 });
      await expect(page.locator('h1', { hasText: 'Cycle Count' })).toBeVisible({ timeout: 5000 });
      
      // Store success data
      await storeTestData(page, 'cycleCountPageNavigation', {
        success: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Navigation to cycle count page failed:', error);
      
      // Store failure data
      await storeTestData(page, 'cycleCountPageNavigation', {
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      });
      
      // Fail the test
      throw error;
    }
  });

  test('should update an existing cycle count task', async ({ page }) => {
    // Get data about a previously created task
    const previousTaskData = await retrieveTestData(page, 'cycleCountCreatedTask');
    
    if (!previousTaskData || !previousTaskData.id) {
      test.skip('No previous cycle count task available');
      return;
    }
    
    // Navigate to cycle count page
    await page.goto('/warehouse-direct-link.html?target=cycle-count');
    await page.locator('button', { hasText: 'Create Cycle Count Task' }).click();
    await page.waitForURL('/cycle-count');
    
    // Find the task by ID
    const taskRow = page.locator(`tr:has-text("${previousTaskData.id}")`).first();
    
    // Verify task exists
    expect(await taskRow.count()).toBe(1);
    
    // Click View Details button
    await taskRow.locator('button', { hasText: 'View Details' }).click();
    
    // Update task status
    await page.click('select[name="status"]');
    await page.selectOption('select[name="status"]', 'in_progress');
    
    // Set start date to now
    await page.fill('input[name="startedAt"]', new Date().toISOString().split('T')[0]);
    
    // Update notes
    const currentNotes = await page.locator('textarea[placeholder="Notes"]').inputValue();
    await page.fill('textarea[placeholder="Notes"]', currentNotes + ' - Updated by automated test');
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    
    // Wait for update confirmation
    await expect(page.locator('.toast-title')).toContainText('Task Updated', { timeout: 5000 });
    
    // Verify status changed in the list
    await page.waitForSelector('table');
    const updatedTaskRow = page.locator(`tr:has-text("${previousTaskData.id}")`).first();
    const updatedStatus = await updatedTaskRow.locator('td').nth(3).textContent();
    expect(updatedStatus?.toLowerCase().trim()).toContain('in progress');
    
    console.log(`Updated cycle count task ${previousTaskData.id} status to: ${updatedStatus}`);
  });
});