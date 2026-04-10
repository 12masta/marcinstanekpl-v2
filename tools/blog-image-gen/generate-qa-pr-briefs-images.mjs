#!/usr/bin/env node
/**
 * QA PR briefs landing illustrations (Gemini image models + optional homepage PNG references).
 * Writes workflow.png and roadmap.png under static/images/qa-pr-briefs/ (default export 1200x420; landing uses these PNGs).
 *
 * Requires GEMINI_API_KEY or GOOGLE_API_KEY (skipped when --print-context only).
 * Loads repo-root `.env` automatically when present.
 *
 * Examples:
 *   npm run qa-pr-briefs:image -- --print-context --refs none
 *   GEMINI_API_KEY=... npm run qa-pr-briefs:image -- --section workflow --refs none
 *   GEMINI_API_KEY=... npm run qa-pr-briefs:image -- --section roadmap --refs hero,qa
 *   GEMINI_API_KEY=... npm run qa-pr-briefs:image -- --all
 *   npm run qa-pr-briefs:image -- --all --width 1200 --height 420
 *
 * After each API response, the image is resized to exact PNG dimensions (sharp).
 */

import { GoogleGenAI } from "@google/genai"
import { createRequire } from "node:module"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import {
  SITE_ILLUSTRATION_STYLE,
  COMPOSITION_QA_LANDING_WORKFLOW,
  COMPOSITION_QA_LANDING_ROADMAP,
} from "./site-image-style.mjs"
import { loadRepoEnv } from "./load-repo-env.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")
const require = createRequire(import.meta.url)
const sharp = require("sharp")

const MODELS = {
  nano: "gemini-2.5-flash-image",
  nano2: "gemini-3.1-flash-image-preview",
}

/** Homepage reference PNG ids (src/images/home/<id>.png) - same as generate-home-image.mjs */
const HOME_REF_SECTION_IDS = [
  "hero",
  "qa",
  "automation",
  "complete_solutions",
  "on_time",
  "inform",
]

/** Default export size (matches landing page placeholders and <img width/height>). */
const DEFAULT_EXPORT = { width: 1200, height: 420 }

/** Order and output filenames under static/images/qa-pr-briefs/ */
const SECTIONS = [
  {
    id: "workflow",
    file: "workflow.png",
    aspectRatio: "21:9",
    exportWidth: DEFAULT_EXPORT.width,
    exportHeight: DEFAULT_EXPORT.height,
    composition: COMPOSITION_QA_LANDING_WORKFLOW,
    scene:
      "From ticket and code change to one structured outcome: gentle left-to-right flow - work-item shape, diff / branch abstraction, and context chips funneling into a stable brief panel silhouette (no text inside), conveying pipeline automation that supports decisions.",
  },
  {
    id: "roadmap",
    file: "roadmap.png",
    aspectRatio: "21:9",
    exportWidth: DEFAULT_EXPORT.width,
    exportHeight: DEFAULT_EXPORT.height,
    composition: COMPOSITION_QA_LANDING_ROADMAP,
    scene:
      "Three connected stages across the frame: (1) PR-level briefs as the entry, (2) test signal and triage as the middle expansion, (3) data contracts, migrations, and downstream data flow as the capstone - abstract icons or soft blocks only, equal visual weight, no numbered captions.",
  },
]

/** English landing copy (sync with src/data/qa-pr-briefs-landing-copy.js) - prompt context only. */
const LANDING_CONTEXT_EN = {
  h1: "QA briefs on every pull request",
  heroLead:
    "Most tools optimize test execution. The harder problem is deciding what deserves attention on each change. Closing the gap between the pull request and a clear verification plan: summary, impacted areas, risk, suggested scenarios, and coverage gaps, delivered where reviewers already work.",
  heroSecondary:
    "Operational risk reduction: less time reading tickets and diffs under pressure, fewer surprises after merge, shared picture of scope before full regression.",
  offerSummary:
    "Structured brief on each PR: plain summary, impacted areas, risk hotspots, suggested scenarios, coverage gaps; can integrate with tracker and CI so the brief lands on the PR.",
  roadmapSummary:
    "Path: PR QA briefs as entry, then test-result intelligence, then clarity on data-impacting changes - same pipeline style, framed as risk reduction.",
}

function loadSiteMetadata() {
  const config = require(path.join(REPO_ROOT, "gatsby-config.js"))
  return config.siteMetadata || {}
}

function outDir() {
  return path.join(REPO_ROOT, "static/images/qa-pr-briefs")
}

function pngPath(sectionId) {
  const def = SECTIONS.find((s) => s.id === sectionId)
  if (!def) throw new Error(`Unknown section ${sectionId}`)
  return path.join(outDir(), def.file)
}

function buildSiteContextBlock() {
  const md = loadSiteMetadata()
  const desc = (md.description || "").replace(/\s+/g, " ").trim()
  const author = md.author?.name || "Marcin Stanek"
  const siteUrl = md.siteUrl || "https://marcinstanek.pl"
  const L = LANDING_CONTEXT_EN
  const lines = [
    `Site: ${siteUrl} - B2B independent QA and test automation contractor; author based in Poland.`,
    `Business summary: ${desc}`,
    `Author: ${author}.`,
    "",
    "Dedicated landing page (English copy, context only - do not render as text in the image):",
    `Headline: ${L.h1}`,
    `Hero: ${L.heroLead}`,
    `Sub: ${L.heroSecondary}`,
    `Offer: ${L.offerSummary}`,
    `Roadmap story: ${L.roadmapSummary}`,
    "",
    "Use the above only as business context. Do not paint slogans, headlines, or any readable words in the image.",
    "Visual intent: independent technical consultant - trustworthy for engineering leaders, neither childish nor cold boardroom.",
  ]
  return lines.join("\n")
}

function parseArgs(argv) {
  const out = {
    section: null,
    all: false,
    prompt: null,
    model: MODELS.nano2,
    refsMode: "all",
    refsList: null,
    printContext: false,
    delayMs: 2500,
    help: false,
    exportWidth: null,
    exportHeight: null,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--section" || a === "-s") out.section = argv[++i]
    else if (a === "--all") out.all = true
    else if (a === "--prompt" || a === "-p") out.prompt = argv[++i]
    else if (a === "--model" || a === "-m") out.model = argv[++i]
    else if (a === "--width") {
      const n = parseInt(argv[++i], 10)
      if (!Number.isFinite(n) || n < 320) {
        console.error("--width must be an integer >= 320")
        process.exit(1)
      }
      out.exportWidth = n
    } else if (a === "--height") {
      const n = parseInt(argv[++i], 10)
      if (!Number.isFinite(n) || n < 120) {
        console.error("--height must be an integer >= 120")
        process.exit(1)
      }
      out.exportHeight = n
    }
    else if (a === "--refs") {
      const v = argv[++i]
      if (!v || v.startsWith("-")) {
        console.error("--refs requires a value: all | none | id1,id2,...")
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
    else if (a === "--delay") out.delayMs = Number(argv[++i]) || 2500
    else if (a === "--help" || a === "-h") out.help = true
  }
  return out
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
    throw new Error(
      `--refs all requires existing homepage PNGs for every section. Missing: ${missing.join(", ")} (under src/images/home/). Use --refs none for a cold start, or --refs hero,qa,... with files that exist.`
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
  return `${siteContext}\n\nThe following PNGs are existing site illustrations. Match their palette, line weight, and overall flat illustration character. Each reference is labeled. Do NOT copy their specific composition or subject - create a fresh scene in the same family: professional, clear, and human-friendly.\n\n`
}

function buildScenePrompt(sectionId, overridePrompt) {
  const def = SECTIONS.find((s) => s.id === sectionId)
  if (!def) {
    throw new Error(`Unknown section "${sectionId}"`)
  }
  const scene =
    overridePrompt?.trim() ||
    def.scene ||
    `Professional tech / QA metaphor for section "${sectionId}".`
  return `Scene to illustrate (creative direction only):\n${scene}\n\n${SITE_ILLUSTRATION_STYLE}\n\n${def.composition}`
}

function buildContents(siteContext, refIds, sectionId, overridePrompt) {
  const prefix = buildInstructionPrefix(siteContext, refIds)
  const refParts = loadHomeReferenceParts(refIds)
  const tail = buildScenePrompt(sectionId, overridePrompt)
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

function resolveExportSize(args, def) {
  const w = args.exportWidth ?? def.exportWidth ?? DEFAULT_EXPORT.width
  const h = args.exportHeight ?? def.exportHeight ?? DEFAULT_EXPORT.height
  return { width: w, height: h }
}

/**
 * Gemini returns variable pixel dimensions; normalize to exact landing asset size.
 */
async function resizeToExactPng(inputBuffer, width, height) {
  return sharp(inputBuffer)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function generateOne(ai, args, sectionId) {
  const siteContext = buildSiteContextBlock()
  const refIds = resolveHomeRefIds(args)
  const contents = buildContents(siteContext, refIds, sectionId, args.prompt)
  const def = SECTIONS.find((s) => s.id === sectionId)
  const outPath = pngPath(sectionId)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const { width: outW, height: outH } = resolveExportSize(args, def)

  const config = buildGenerateConfig(args.model, def.aspectRatio)
  console.error(`Model: ${args.model}`)
  console.error(`Aspect: ${def.aspectRatio}`)
  console.error(`Export: ${outW}x${outH} PNG (sharp resize after API)`)
  console.error(`Section: ${sectionId}`)
  console.error(`Refs: ${refIds.length ? refIds.join(", ") : "(none)"}`)
  console.error(`Output: ${path.relative(REPO_ROOT, outPath)}`)

  const response = await ai.models.generateContent({
    model: args.model,
    contents,
    config,
  })
  const rawBuf = extractImageBuffer(response)
  const finalBuf = await resizeToExactPng(rawBuf, outW, outH)
  fs.writeFileSync(outPath, finalBuf)
  console.log(outPath)
}

async function main() {
  loadRepoEnv()
  const args = parseArgs(process.argv)
  const sectionIds = SECTIONS.map((s) => s.id)

  if (args.help) {
    console.log(`Usage: npm run qa-pr-briefs:image -- [options]

Sections: ${sectionIds.join(", ")}

Writes to: static/images/qa-pr-briefs/{workflow,roadmap}.png
Each file is resized to exactly ${DEFAULT_EXPORT.width}x${DEFAULT_EXPORT.height} (override with --width / --height).

Options:
  --section, -s   One section id (required unless --all)
  --all           Generate every section in order (${sectionIds.join(" → ")})
  --prompt, -p    Override scene description for the current --section only
  --model, -m     ${MODELS.nano2} (default) | ${MODELS.nano} | full model id
  --width         Export width in px (default: ${DEFAULT_EXPORT.width} for all sections)
  --height        Export height in px (default: ${DEFAULT_EXPORT.height} for all sections)
  --refs          all (default) | none | comma-separated homepage ids, e.g. hero,qa
                  Default "all" uses every src/images/home/<id>.png when present.
  --print-context Print site + landing context, ref plan, scene(s); no API call
  --delay         Milliseconds between requests when using --all (default: 2500)

Environment:
  GEMINI_API_KEY or GOOGLE_API_KEY - required unless --print-context
  Also read from repo-root .env if the file exists (does not override existing env vars).
`)
    process.exit(0)
  }

  const siteContext = buildSiteContextBlock()

  if (args.printContext) {
    console.log("=== Site + landing context (prompt block) ===\n")
    console.log(siteContext)
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
    } else {
      console.log(refIds.join(", "))
    }
    if (args.section) {
      if (!sectionIds.includes(args.section)) {
        console.error(`Unknown section "${args.section}". Expected: ${sectionIds.join(", ")}`)
        process.exit(1)
      }
      console.log("\n=== Scene prompt ===\n")
      console.log(buildScenePrompt(args.section, args.prompt))
    } else {
      console.log("\n=== Scene prompts (all sections) ===\n")
      for (const id of sectionIds) {
        console.log(`--- ${id} (${SECTIONS.find((s) => s.id === id).aspectRatio}) ---`)
        console.log(buildScenePrompt(id, null))
        console.log("")
      }
    }
    process.exit(0)
  }

  if (args.all && args.section) {
    console.error("Use either --all or --section, not both.")
    process.exit(1)
  }
  if (!args.all && !args.section) {
    console.error("Provide --section <id> or --all.")
    process.exit(1)
  }
  if (args.all && args.prompt) {
    console.error("--prompt applies to a single section only; do not combine with --all.")
    process.exit(1)
  }

  if (args.section && !sectionIds.includes(args.section)) {
    console.error(`Unknown section "${args.section}". Expected: ${sectionIds.join(", ")}`)
    process.exit(1)
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    console.error(
      "Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment or in repo-root .env (not committed)."
    )
    process.exit(1)
  }

  const ai = new GoogleGenAI({ apiKey })

  if (args.all) {
    for (let i = 0; i < sectionIds.length; i++) {
      const id = sectionIds[i]
      if (i > 0) await sleep(args.delayMs)
      await generateOne(ai, args, id)
    }
    return
  }

  await generateOne(ai, args, args.section)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
