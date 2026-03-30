#!/usr/bin/env node
/**
 * Local OG / hero image generator using Gemini image models.
 * Writes PNGs under src/images/blog/<slug>/ to match existing src/images layout.
 *
 * Flow matches the homepage generator: site + article context block, optional
 * homepage illustration PNGs as style references (--refs), multi-part API contents,
 * and --print-context to preview prompts without calling the API.
 *
 * Requires GEMINI_API_KEY or GOOGLE_API_KEY (skipped when --print-context only).
 *
 * Examples:
 *   npm run blog:image -- --print-context --refs none --file content/blog/.../post.markdown
 *   GEMINI_API_KEY=... npm run blog:image -- --file content/blog/.../post.markdown --refs none
 *   GEMINI_API_KEY=... npm run blog:image -- --slug noisy-ci-signal --refs hero,qa
 *   npm run blog:image -- --aspect 16:9
 */

import { GoogleGenAI } from "@google/genai"
import { createRequire } from "node:module"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import {
  SITE_ILLUSTRATION_STYLE,
  COMPOSITION_BLOG_OG,
} from "./site-image-style.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")
const require = createRequire(import.meta.url)

/** Same ids as generate-home-image.mjs — reference PNGs under src/images/home/<id>.png */
const HOME_REF_SECTION_IDS = [
  "hero",
  "qa",
  "automation",
  "complete_solutions",
  "on_time",
  "inform",
]

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
    /** 'all' | 'none' | explicit list from --refs (homepage PNGs for palette / line weight) */
    refsMode: "all",
    refsList: null,
    printContext: false,
    help: false,
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
    else if (a === "--refs") {
      const v = argv[++i]
      if (!v || v.startsWith("-")) {
        console.error("--refs requires a value: all | none | hero,qa,...")
        process.exit(1)
      }
      if (v === "all" || v === "none") {
        out.refsMode = v
        out.refsList = null
      } else {
        out.refsMode = "explicit"
        out.refsList = v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
    } else if (a === "--print-context") out.printContext = true
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

function loadSiteMetadata() {
  const config = require(path.join(REPO_ROOT, "gatsby-config.js"))
  return config.siteMetadata || {}
}

function buildBlogSiteContextBlock(fm) {
  const md = loadSiteMetadata()
  const siteDesc = (md.description || "").replace(/\s+/g, " ").trim()
  const author = md.author?.name || "Marcin Stanek"
  const siteUrl = md.siteUrl || "https://marcinstanek.pl"
  const title = fm.title || "Blog post"
  const postDesc = (fm.description || "").replace(/\s+/g, " ").trim()
  const lines = [
    `Site: ${siteUrl} — B2B independent QA and test automation contractor; author based in Poland; primary site copy is also offered in Polish.`,
    `Business summary: ${siteDesc}`,
    `Author: ${author}.`,
    "",
    "Article (context for illustration only — do not render as text in the image):",
    `Title: ${title}`,
    `Summary: ${postDesc}`,
    "",
    "Use the above only as business context. Do not paint slogans, headlines, or any readable words in the image.",
    "Visual intent: independent technical consultant — trustworthy and approachable for engineering teams, neither childish nor cold boardroom.",
  ]
  return lines.join("\n")
}

function homeRefPngPath(id) {
  return path.join(REPO_ROOT, "src/images/home", `${id}.png`)
}

function resolveHomeRefIds(args) {
  if (args.refsMode === "none") return []
  if (args.refsMode === "explicit") {
    for (const id of args.refsList) {
      if (!HOME_REF_SECTION_IDS.includes(id)) {
        throw new Error(
          `Unknown ref id "${id}". Expected one of: ${HOME_REF_SECTION_IDS.join(", ")}`
        )
      }
    }
    return args.refsList
  }
  const missing = []
  for (const id of HOME_REF_SECTION_IDS) {
    if (!fs.existsSync(homeRefPngPath(id))) missing.push(id)
  }
  if (missing.length > 0) {
    const homeDir = path.join(REPO_ROOT, "src/images/home")
    throw new Error(
      `--refs all requires existing homepage PNGs for every section. Missing: ${missing.join(", ")} (under ${path.relative(REPO_ROOT, homeDir)}). Use --refs none for a cold start, or --refs hero,qa,... with files that exist.`
    )
  }
  return [...HOME_REF_SECTION_IDS]
}

function loadHomeReferenceParts(refIds) {
  const parts = []
  for (const id of refIds) {
    const filePath = homeRefPngPath(id)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Reference file missing: ${filePath}`)
    }
    const buf = fs.readFileSync(filePath)
    const data = buf.toString("base64")
    parts.push({
      text: `Reference image (existing homepage art, file ${id}.png):`,
    })
    parts.push({
      inlineData: { mimeType: "image/png", data },
    })
  }
  return parts
}

function buildInstructionPrefix(siteContext, refIds) {
  if (refIds.length === 0) {
    return `${siteContext}\n\nGenerate a new illustration with no reference images supplied; rely on the style rules below.\n\n`
  }
  return `${siteContext}\n\nThe following PNGs are existing homepage illustrations. Match their palette, line weight, and overall flat illustration character. Each reference is labeled. Do NOT copy their specific composition or subject — create a fresh scene in the same family: professional, clear, and human-friendly.\n\n`
}

function buildBlogScenePrompt(fm, userPrompt) {
  const scene =
    userPrompt?.trim() ||
    `Professional tech / QA metaphor for the article topic (title and summary in context above). One clear idea, readable at small preview size.`
  return `Scene to illustrate (creative direction only):\n${scene}\n\n${SITE_ILLUSTRATION_STYLE}\n\nNote: wide Open Graph / in-article banner for a technical blog — low vertical height, strong left-to-right read.\n\n${COMPOSITION_BLOG_OG}`
}

function buildBlogContents(siteContext, refIds, fm, userPrompt) {
  const prefix = buildInstructionPrefix(siteContext, refIds)
  const refParts = loadHomeReferenceParts(refIds)
  const tail = buildBlogScenePrompt(fm, userPrompt)
  return [{ text: prefix }, ...refParts, { text: tail }]
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
  --file, -f        Path to a blog .markdown file (from repo root or absolute)
  --slug, -s        Folder slug under content/blog/... (alternative to --file)
  --prompt, -p      Override scene description (still uses site + article context above the scene)
  --out, -o         Output PNG path (default: src/images/blog/<slug>/og.png)
  --model, -m       ${MODELS.nano2} (default, required for 4:1) | ${MODELS.nano} | full model id
  --aspect, -a      Aspect ratio (default: 4:1; with ${MODELS.nano} use 21:9 or 16:9)
  --refs            all (default) | none | comma-separated homepage ids, e.g. hero,qa
                    Default "all" uses every src/images/home/<id>.png (same family as home:image).
  --print-context   Print site + article context, ref plan, and scene prompt; no API call
  --public          Also write static/images/blog/<slug>/og.png (served at /images/blog/... after build)

Environment:
  GEMINI_API_KEY or GOOGLE_API_KEY — required unless --print-context
`)
    process.exit(0)
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

  if (args.printContext) {
    let fm = {}
    if (filePath) {
      const resolved = path.isAbsolute(filePath)
        ? filePath
        : path.join(REPO_ROOT, filePath)
      if (!fs.existsSync(resolved)) {
        console.error(`File not found: ${resolved}`)
        process.exit(1)
      }
      const md = fs.readFileSync(resolved, "utf8")
      fm = parseSimpleFrontmatter(md)
    } else {
      console.log(
        "Note: no --file/--slug — article lines in the context block are placeholders.\n"
      )
    }
    console.log("=== Site + article context (prompt block) ===\n")
    console.log(buildBlogSiteContextBlock(fm))
    console.log("\n=== Style suffix (composition) ===\n")
    console.log(COMPOSITION_BLOG_OG)
    console.log("\n=== Reference plan (homepage PNGs) ===\n")
    let refIds
    try {
      refIds = resolveHomeRefIds(args)
    } catch (e) {
      console.error(e.message || e)
      process.exit(1)
    }
    if (refIds.length === 0) {
      console.log("(no reference images)")
    } else if (args.refsMode === "explicit") {
      console.log(refIds.join(", ") || "(empty)")
      for (const id of refIds) {
        const p = homeRefPngPath(id)
        console.log(
          `  ${id}: ${fs.existsSync(p) ? "exists" : "MISSING"} ${path.relative(REPO_ROOT, p)}`
        )
      }
    } else {
      for (const id of refIds) {
        const p = homeRefPngPath(id)
        console.log(
          `  ${id}: ${fs.existsSync(p) ? "exists" : "MISSING"} ${path.relative(REPO_ROOT, p)}`
        )
      }
    }
    console.log("\n=== Scene prompt ===\n")
    console.log(buildBlogScenePrompt(fm, args.prompt))
    process.exit(0)
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    console.error(
      "Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment (not committed; use .env locally if you load it)."
    )
    process.exit(1)
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
  const siteContext = buildBlogSiteContextBlock(fm)
  let refIds
  try {
    refIds = resolveHomeRefIds(args)
  } catch (e) {
    console.error(e.message || e)
    process.exit(1)
  }
  const contents = buildBlogContents(siteContext, refIds, fm, args.prompt)

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
  console.error(`Refs: ${refIds.length ? refIds.join(", ") : "(none)"}`)
  console.error(`Output: ${path.relative(REPO_ROOT, outPath)}`)

  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  })

  const buf = extractImageBuffer(response)
  fs.writeFileSync(outPath, buf)
  console.log(outPath)

  const siteUrl = loadSiteMetadata().siteUrl || "https://marcinstanek.pl"
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
