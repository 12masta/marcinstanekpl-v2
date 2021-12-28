// global-setup.ts
import { request, FullConfig, APIResponse } from "@playwright/test"

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const api = await request.newContext()
  let response: APIResponse
  do {
    try {
      response = await api.get(baseURL, {
        failOnStatusCode: false,
        ignoreHTTPSErrors: true,
        timeout: 2000,
      })
    } catch (e) {
      console.log(
        "Request for warming up gatsby fails with " +
          e +
          ". It happens often for the first requests after bringing this up. Retrying..."
      )
    }
  } while (response === undefined || !response.ok())
}

export default globalSetup
