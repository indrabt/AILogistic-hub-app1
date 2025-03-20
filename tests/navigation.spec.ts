import { test, expect } from '@playwright/test';

/**
 * Navigation tests for warehouse functions
 * 
 * These tests verify that our navigation solution for warehouse pages
 * works correctly, especially focusing on the direct HTML approach
 * for problematic routes like warehouse picking and packing
 */

test.describe('Warehouse navigation tests', () => {
  test('should navigate to warehouse dashboard', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Expand the Warehouse dropdown in the sidebar
    await page.click('text=Warehouse');
    
    // Click on Dashboard
    await page.click('text=Dashboard >> nth=1'); // Second instance to get the one in the dropdown
    
    // Verify we're at the warehouse dashboard
    await expect(page).toHaveURL('/warehouse-dashboard');
    await expect(page.locator('h1')).toContainText('Warehouse Dashboard');
  });

  test('should navigate to warehouse picking using direct link', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Expand the Warehouse dropdown in the sidebar
    await page.click('text=Warehouse');
    
    // Click on Picking - this now uses a direct HTML link
    await page.click('text=Picking');
    
    // Verify we're at the warehouse picking page
    await page.waitForURL('/warehouse-picking');
    await expect(page).toHaveURL('/warehouse-picking');
    await expect(page.locator('h1, .page-title')).toContainText('Pick Tasks');
    
    // Check if our navigation tracker has set the flag
    const flag = await page.evaluate(() => sessionStorage.getItem('directWarehousePickingAccess'));
    expect(flag).toBe('true');
  });

  test('should navigate to warehouse packing using direct link', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Expand the Warehouse dropdown in the sidebar
    await page.click('text=Warehouse');
    
    // Click on Packing - this now uses a direct HTML link
    await page.click('text=Packing');
    
    // Verify we're at the warehouse packing page
    await page.waitForURL('/warehouse-packing');
    await expect(page).toHaveURL('/warehouse-packing');
    await expect(page.locator('h1, .page-title')).toContainText('Packing Tasks');
    
    // Check if our navigation tracker has set the flag
    const flag = await page.evaluate(() => sessionStorage.getItem('directWarehousePackingAccess'));
    expect(flag).toBe('true');
  });

  test('should use navigation test page to verify direct links', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Go to the navigation test page
    await page.goto('/navigation-test');
    
    // Wait for the test page to load
    await expect(page.locator('h1')).toContainText('Navigation Test Page');
    
    // Click on the "Warehouse Picking" direct link
    await page.click('a:has-text("Warehouse Picking")');
    
    // Verify we're at the warehouse picking page
    await page.waitForURL('/warehouse-picking');
    await expect(page).toHaveURL('/warehouse-picking');
    
    // Go back to the navigation test page
    await page.goto('/navigation-test');
    
    // Click on the "Warehouse Packing" direct link
    await page.click('a:has-text("Warehouse Packing")');
    
    // Verify we're at the warehouse packing page
    await page.waitForURL('/warehouse-packing');
    await expect(page).toHaveURL('/warehouse-packing');
  });

  test('should store navigation flags in session storage', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Go to the navigation test page
    await page.goto('/navigation-test');
    
    // Click the "Test All Navigation" button
    await page.click('button:has-text("Test All Navigation")');
    
    // Wait for navigation to warehouse picking to complete
    await page.waitForURL('/warehouse-picking');
    
    // Go back to the navigation test page to check results
    await page.goto('/navigation-test');
    
    // Switch to the test results tab
    await page.click('button:has-text("Test Results")');
    
    // Check that we have some test results
    await expect(page.locator('.space-y-2')).not.toContainText('No test results available');
    
    // Check for a success result
    await expect(page.locator('.space-y-2')).toContainText('Success');
  });
});

test.describe('Order Management navigation tests', () => {
  test('should navigate to order management page', async ({ page }) => {
    // Start from the main page
    await page.goto('/');

    // Fill login credentials
    await page.fill('[placeholder="Username"]', 'manager1');
    await page.fill('[placeholder="Password"]', 'password');
    
    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Click on Orders in the sidebar
    await page.click('text=Orders');
    
    // Verify we're at the orders page
    await page.waitForURL('/orders-direct');
    await expect(page).toHaveURL('/orders-direct');
    await expect(page.locator('h1')).toContainText('Orders');
    
    // Check if our navigation tracker has set the flag
    const flag = await page.evaluate(() => sessionStorage.getItem('ordersDirectAccessed'));
    expect(flag).toBe('true');
  });
});