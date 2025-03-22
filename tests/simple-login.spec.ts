import { test, expect } from '@playwright/test';

/**
 * Simple Login Test
 * 
 * This test verifies basic login functionality works.
 * It's a simpler test that should run quickly and reliably.
 */

test('should login as warehouse staff', async ({ page }) => {
  // Go to the login page
  await page.goto('/');
  console.log('Navigated to the login page');
  
  // Verify the login form is visible
  await expect(page.locator('form')).toBeVisible();
  console.log('Login form is visible');
  
  // Fill in the username and password fields
  await page.fill('[placeholder="Username"]', 'warehouse1');
  await page.fill('[placeholder="Password"]', 'password');
  console.log('Filled in username and password');
  
  // Click the login button
  await page.click('button[type="submit"]');
  console.log('Clicked login button');
  
  // Wait for navigation to complete (with a short timeout)
  try {
    // Allow for navigation to either dashboard or home page
    await Promise.race([
      page.waitForURL('/warehouse-dashboard', { timeout: 5000 }),
      page.waitForURL('/dashboard', { timeout: 5000 })
    ]);
    console.log('Successfully logged in and navigated to dashboard');
  } catch (error) {
    console.log('Navigation timeout, checking if we are logged in anyway');
    
    // Check if we see any element that indicates successful login
    const loggedIn = await page.locator('text=Warehouse Dashboard, text=Logout').count() > 0;
    expect(loggedIn).toBeTruthy();
  }
});