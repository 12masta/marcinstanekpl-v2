/**
 * Default Playwright config when no --config is passed.
 * Based on tests/local.config.ts (Gatsby develop on port 8000).
 * Always reuse an existing server on 8000 so `CI=true` or a running `npm start`
 * does not block the webServer hook.
 */
import type { PlaywrightTestConfig } from "@playwright/test"
import localConfig from "./tests/local.config"

const config: PlaywrightTestConfig = {
  ...localConfig,
  webServer: localConfig.webServer
    ? {
        ...localConfig.webServer,
        reuseExistingServer: true,
        timeout: 180 * 1000,
      }
    : undefined,
}

export default config
