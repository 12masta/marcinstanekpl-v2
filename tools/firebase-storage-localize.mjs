#!/usr/bin/env node
/**
 * Downloads Firebase Storage objects referenced in blog markdown under content/
 * into static/media-from-firebase/ and rewrites URLs to local /media-from-firebase/... paths.
 *
 * Full bucket mirror (optional, requires gcloud auth):
 *   gsutil -m cp -r gs://marcinstanek-a2c3b.appspot.com/* static/media-from-firebase/
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content")
const STATIC_OUT = path.join(ROOT, "static", "media-from-firebase")
const PUBLIC_PREFIX = "/media-from-firebase"

/** Match Firebase download URLs in markdown / Liquid-style attributes. */
const FIREBASE_URL_RE =
  /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/[^?\s"'<>]+(?:\?[^)\s"'<>]*)?/g

function objectPathFromUrl(url) {
  let pathname
  try {
    pathname = new URL(url).pathname
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }
  const m = pathname.match(/\/o\/(.+)/)
  if (!m) throw new Error(`No /o/ path in URL: ${url}`)
  return decodeURIComponent(m[1])
}

function publicUrlFromObjectPath(objectPath) {
  return (
    PUBLIC_PREFIX +
    "/" +
    objectPath.split("/").map(encodeURIComponent).join("/")
  )
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await collectMarkdownFiles(p)))
    else if (e.name.endsWith(".markdown")) out.push(p)
  }
  return out
}

function uniqueUrlsFromText(text) {
  const set = new Set()
  let m
  const re = new RegExp(FIREBASE_URL_RE.source, "g")
  while ((m = re.exec(text)) !== null) set.add(m[0])
  return set
}

async function downloadOne(url, destFsPath) {
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.mkdir(path.dirname(destFsPath), { recursive: true })
  await fs.writeFile(destFsPath, buf)
}

async function pool(items, limit, fn) {
  let next = 0
  async function worker() {
    while (true) {
      const i = next++
      if (i >= items.length) break
      await fn(items[i], i)
    }
  }
  const n = Math.min(limit, items.length) || 1
  await Promise.all(Array.from({ length: n }, () => worker()))
}

async function main() {
  const argv = process.argv.slice(2)
  const rewriteOnly = argv.includes("--rewrite-only")
  const downloadOnly = argv.includes("--download-only")

  const mdFiles = await collectMarkdownFiles(CONTENT_DIR)
  const allUrls = new Set()
  for (const f of mdFiles) {
    const text = await fs.readFile(f, "utf8")
    for (const u of uniqueUrlsFromText(text)) allUrls.add(u)
  }

  const urls = [...allUrls].sort()
  console.error(`Found ${urls.length} unique Firebase Storage URLs in content.`)

  const urlToPublic = new Map()
  const pathToCanonicalUrl = new Map()
  for (const url of urls) {
    const objectPath = objectPathFromUrl(url)
    urlToPublic.set(url, publicUrlFromObjectPath(objectPath))
    if (!pathToCanonicalUrl.has(objectPath)) pathToCanonicalUrl.set(objectPath, url)
  }

  if (!rewriteOnly) {
    await fs.mkdir(STATIC_OUT, { recursive: true })
    const tasks = [...pathToCanonicalUrl.entries()].map(([objectPath, url]) => ({
      objectPath,
      url,
      dest: path.join(STATIC_OUT, ...objectPath.split("/")),
    }))

    const failures = []
    await pool(tasks, 6, async ({ objectPath, url, dest }) => {
      try {
        await downloadOne(url, dest)
        console.error(`OK ${objectPath}`)
      } catch (e) {
        console.error(`FAIL ${objectPath}: ${e.message}`)
        failures.push({ objectPath, url, error: e.message })
      }
    })

    if (failures.length) {
      console.error(`\n${failures.length} download(s) failed.`)
      process.exitCode = 1
      if (!downloadOnly) {
        console.error("Aborting rewrite because some downloads failed.")
        return
      }
    }
  }

  if (!downloadOnly) {
    let filesChanged = 0
    for (const f of mdFiles) {
      let text = await fs.readFile(f, "utf8")
      const original = text
      const byLength = [...urlToPublic.entries()].sort((a, b) => b[0].length - a[0].length)
      for (const [from, to] of byLength) {
        if (text.includes(from)) text = text.split(from).join(to)
      }
      if (text !== original) {
        await fs.writeFile(f, text, "utf8")
        filesChanged++
      }
    }
    console.error(`Rewrote Firebase URLs in ${filesChanged} markdown file(s).`)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
