/**
 * Load GEMINI_API_KEY / GOOGLE_API_KEY (and other vars) from the repo-root `.env`
 * when the file exists. Does not override variables already set in the process
 * environment (shell wins).
 *
 * Uses the `dotenv` package from the project root (Gatsby already pulls it in).
 */

import { createRequire } from "node:module"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")

let loaded = false

export function loadRepoEnv() {
  if (loaded) return
  loaded = true
  const envPath = path.join(REPO_ROOT, ".env")
  if (!fs.existsSync(envPath)) return
  const require = createRequire(import.meta.url)
  const dotenv = require("dotenv")
  dotenv.config({ path: envPath })
}
