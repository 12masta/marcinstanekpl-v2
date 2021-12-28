// local.config.ts
import { PlaywrightTestConfig, devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run serve",
    port: 9000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  globalSetup: require.resolve('./global-setup'),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:9000/',
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
}
export default config
