// local.config.ts
import { PlaywrightTestConfig, devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  reporter: [["junit", { outputFile: "results-lighthouse.xml" }]],
  webServer: {
    command: "npm run serve",
    port: 9000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  globalSetup: require.resolve("./global-setup"),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 900000,
  use: {
    baseURL: "http://localhost:9000/",
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
