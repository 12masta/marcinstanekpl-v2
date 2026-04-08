// global-setup.ts
import { request, FullConfig, APIResponse } from "@playwright/test"

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  if (!baseURL) return

  const api = await request.newContext()

  async function getOk(url: string): Promise<APIResponse | null> {
    try {
      return await api.get(url, {
        failOnStatusCode: false,
        ignoreHTTPSErrors: true,
        timeout: 60_000,
      })
    } catch {
      return null
    }
  }

  const maxAttempts = 45
  let response: APIResponse | null = null
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    response = await getOk(baseURL)
    if (response?.ok()) break
    await new Promise(r => setTimeout(r, 2_000))
  }
  if (!response?.ok()) {
    throw new Error(
      `globalSetup: could not reach ${baseURL} after ${maxAttempts} attempts (${
        response?.status() ?? "no response"
      }). Start Gatsby first (npm start) or wait for webServer.`
    )
  }

  /** Prime `gatsby serve` + disk cache for routes Lighthouse hits first (reduces cold perf noise). */
  const warmPaths = ["/", "/en/", "/blog/pl/", "/blog/en/"]
  for (const path of warmPaths) {
    const url = new URL(path, baseURL).href
    for (let i = 0; i < 2; i++) {
      const r = await getOk(url)
      if (!r?.ok()) {
        console.log(`Warm-up GET ${url} returned ${r?.status() ?? "error"} (attempt ${i + 1})`)
      }
    }
  }
}

export default globalSetup
