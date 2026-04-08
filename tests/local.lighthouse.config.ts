// local.config.ts
import { PlaywrightTestConfig, devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run start",
    port: 8000,
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  globalSetup: require.resolve("./global-setup"),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  timeout: 900000,
  use: {
    baseURL: "http://localhost:8000/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ],
}
export default config
