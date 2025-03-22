import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Disable parallel execution for Replit
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Limit to 1 worker for Replit's resources
  reporter: 'list', // Use simple list reporter instead of HTML
  // Use the port the server is actually running on
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'off', // Disable trace to conserve resources
    video: 'off', // Disable video to conserve resources
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote'
      ],
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || undefined,
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
  // No webServer config needed as we're using the running server
});