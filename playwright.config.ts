import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Use the port the server is actually running on
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    video: 'on',
    // Automatically capture a screenshot after each test
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
  // No webServer config needed as we're using the running server
});