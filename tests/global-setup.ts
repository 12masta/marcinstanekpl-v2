// global-setup.ts
import { request, FullConfig, APIResponse } from "@playwright/test"

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  if (!baseURL) return

  const api = await request.newContext()

  async function getOk(url: string): Promise<APIResponse> {
    return api.get(url, {
      failOnStatusCode: false,
      ignoreHTTPSErrors: true,
      timeout: 60_000,
    })
  }

  let response: APIResponse | undefined
  do {
    try {
      response = await getOk(baseURL)
    } catch (e) {
      console.log(
        "Request for warming up gatsby fails with " +
          e +
          ". It happens often for the first requests after bringing this up. Retrying..."
      )
    }
  } while (response === undefined || !response.ok())

  /** Prime `gatsby serve` + disk cache for routes Lighthouse hits first (reduces cold perf noise). */
  const warmPaths = ["/", "/en/", "/blog/pl/", "/blog/en/"]
  for (const path of warmPaths) {
    const url = new URL(path, baseURL).href
    for (let i = 0; i < 2; i++) {
      const r = await getOk(url)
      if (!r.ok()) {
        console.log(`Warm-up GET ${url} returned ${r.status()} (attempt ${i + 1})`)
      }
    }
  }
}

export default globalSetup
