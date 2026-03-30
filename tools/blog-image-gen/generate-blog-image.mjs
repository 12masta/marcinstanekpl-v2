#!/usr/bin/env node
/**
 * Local OG / hero image generator using Gemini "Nano Banana" image models.
 * Writes PNGs under src/images/blog/<slug>/ to match existing src/images layout.
 *
 * Requires GEMINI_API_KEY (or GOOGLE_API_KEY) from the environment.
 *
 * Examples:
 *   GEMINI_API_KEY=... npm run blog:image -- --file content/blog/2026-03-29-noisy-ci-signal/2026-03-29-noisy-ci-signal.markdown
 *   npm run blog:image -- --slug noisy-ci-signal --prompt "abstract illustration of flaky CI pipelines"
 *   npm run blog:image -- --aspect 16:9   # taller social preview
 */

import { GoogleGenAI } from "@google/genai"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { BLOG_IMAGE_STYLE_PROMPT } from "./site-image-style.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")

const MODELS = {
  nano: "gemini-2.5-flash-image",
  nano2: "gemini-3.1-flash-image-preview",
}

/** Verified: gemini-2.5-flash-image returns 400 for 4:1; use 3.1 or 21:9 on 2.5. */
const NANO_NO_4_1 = `4:1`

function parseArgs(argv) {
  const out = {
    file: null,
    slug: null,
    prompt: null,
    outPath: null,
    /** 4:1 needs 3.1 image model; 2.5 max wide is 21:9. */
    model: MODELS.nano2,
    /** 4:1 ≈ half the height of 16:9 at the same width; good for in-page banners. */
    aspectRatio: "4:1",
    alsoPublic: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--file" || a === "-f") out.file = argv[++i]
    else if (a === "--slug" || a === "-s") out.slug = argv[++i]
    else if (a === "--prompt" || a === "-p") out.prompt = argv[++i]
    else if (a === "--out" || a === "-o") out.outPath = argv[++i]
    else if (a === "--model" || a === "-m") out.model = argv[++i]
    else if (a === "--aspect" || a === "-a") out.aspectRatio = argv[++i]
    else if (a === "--public") out.alsoPublic = true
    else if (a === "--help" || a === "-h") out.help = true
  }
  return out
}

function parseSimpleFrontmatter(md) {
  if (!md.startsWith("---")) return {}
  const end = md.indexOf("\n---", 3)
  if (end === -1) return {}
  const block = md.slice(3, end)
  const fm = {}
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    fm[m[1]] = v
  }
  return fm
}

function slugFromPostPath(filePath) {
  return path.basename(path.dirname(filePath))
}

function buildPromptFromPost(fm, userPrompt) {
  if (userPrompt) {
    return `${userPrompt.trim()}\n\n${BLOG_IMAGE_STYLE_PROMPT}`
  }
  const title = fm.title || "Blog post"
  const desc = fm.description || ""
  return `Create a single wide illustration for this blog article (use topic below only as creative direction — do not write the title or any words in the image).

Topic / title: ${title}
Summary: ${desc}

${BLOG_IMAGE_STYLE_PROMPT}`
}

function extractImageBuffer(response) {
  const c = response?.candidates?.[0]
  if (!c) {
    const pf = response?.promptFeedback
    const msg = pf ? JSON.stringify(pf) : "no candidates in API response"
    throw new Error(msg)
  }
  const parts = c.content?.parts || []
  for (const part of parts) {
    const data = part.inlineData?.data
    if (data) return Buffer.from(data, "base64")
  }
  throw new Error("No image bytes in response (expected inlineData part).")
}

function buildGenerateConfig(model, aspectRatio) {
  const imageConfig = { aspectRatio }
  if (model.includes("gemini-3.1") || model.includes("gemini-3-pro-image")) {
    imageConfig.imageSize = "2K"
  }
  return { imageConfig }
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    console.log(`Usage: npm run blog:image -- [options]

Options:
  --file, -f     Path to a blog .markdown file (from repo root or absolute)
  --slug, -s     Folder slug under content/blog/... (alternative to --file)
  --prompt, -p   Custom prompt (skips title/description from frontmatter)
  --out, -o      Output PNG path (default: src/images/blog/<slug>/og.png)
  --model, -m    ${MODELS.nano2} (default, required for 4:1) | ${MODELS.nano} | full model id
  --aspect, -a   Aspect ratio (default: 4:1; with ${MODELS.nano} use 21:9 or 16:9)
  --public       Also write static/images/blog/<slug>/og.png (served at /images/blog/... after build)

Environment:
  GEMINI_API_KEY or GOOGLE_API_KEY — required for the Gemini API
`)
    process.exit(0)
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    console.error(
      "Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment (not committed; use .env locally if you load it)."
    )
    process.exit(1)
  }

  let filePath = args.file
  if (!filePath && args.slug) {
    const dir = path.join(REPO_ROOT, "content/blog")
    const matches = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.includes(args.slug))
      .map((d) => d.name)
    if (matches.length !== 1) {
      console.error(
        matches.length === 0
          ? `No content/blog folder matching slug "${args.slug}".`
          : `Ambiguous slug "${args.slug}": ${matches.join(", ")}`
      )
      process.exit(1)
    }
    const folder = path.join(dir, matches[0])
    const candidates = fs
      .readdirSync(folder)
      .filter((n) => n.endsWith(".markdown"))
    const pick =
      candidates.find((n) => !n.endsWith("-en.markdown")) || candidates[0]
    if (!pick) {
      console.error(`No .markdown file in ${folder}`)
      process.exit(1)
    }
    filePath = path.join(folder, pick)
  }

  if (!filePath) {
    console.error("Provide --file <path> or --slug <post-slug>.")
    process.exit(1)
  }

  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(REPO_ROOT, filePath)
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`)
    process.exit(1)
  }

  const md = fs.readFileSync(resolved, "utf8")
  const fm = parseSimpleFrontmatter(md)
  const slug = fm.slug || slugFromPostPath(resolved)
  const prompt = buildPromptFromPost(fm, args.prompt)

  const outPath =
    args.outPath ||
    path.join(REPO_ROOT, "src/images/blog", slug, "og.png")
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  const model = args.model
  if (model.includes(`gemini-2.5-flash-image`) && args.aspectRatio === NANO_NO_4_1) {
    console.error(
      `Aspect ratio ${args.aspectRatio} is not supported by ${MODELS.nano}. Use --model ${MODELS.nano2} or --aspect 21:9 (widest on 2.5).`
    )
    process.exit(1)
  }

  const ai = new GoogleGenAI({ apiKey })
  const config = buildGenerateConfig(model, args.aspectRatio)

  console.error(`Model: ${model}`)
  console.error(`Aspect: ${args.aspectRatio}`)
  console.error(`Output: ${path.relative(REPO_ROOT, outPath)}`)

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config,
  })

  const buf = extractImageBuffer(response)
  fs.writeFileSync(outPath, buf)
  console.log(outPath)

  const siteUrl = "https://marcinstanek.pl"
  const webPath = `/images/blog/${slug}/og.png`

  if (args.alsoPublic) {
    const pubPath = path.join(REPO_ROOT, "static/images/blog", slug, "og.png")
    fs.mkdirSync(path.dirname(pubPath), { recursive: true })
    fs.writeFileSync(pubPath, buf)
    console.error(`Also wrote: ${path.relative(REPO_ROOT, pubPath)}`)
    console.error(
      `\nSuggested frontmatter:\n  ogImage: ${siteUrl}${webPath}\n  ogImageType: image/png\n`
    )
  } else {
    console.error(
      `\nImage is under src/images (same asset family as home/illustrations). For a public URL like ${siteUrl}${webPath}, run again with --public, or copy the PNG to static/images/blog/${slug}/og.png.\n`
    )
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
