#!/usr/bin/env node
/**
 * Homepage illustration generator (Gemini image models + optional PNG references).
 * Writes 1:1 PNGs under src/images/home/ (hero.png, qa.png, …).
 *
 * Requires GEMINI_API_KEY or GOOGLE_API_KEY (skipped when --print-context only).
 * Loads repo-root `.env` automatically when present (same as blog:image / qa-pr-briefs:image).
 *
 * Examples:
 *   npm run home:image -- --print-context --refs none
 *   GEMINI_API_KEY=... npm run home:image -- --section hero --refs none
 *   GEMINI_API_KEY=... npm run home:image -- --section qa --refs hero,automation
 *   GEMINI_API_KEY=... npm run home:image -- --all
 */

import { GoogleGenAI } from "@google/genai"
import { createRequire } from "node:module"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import {
  SITE_ILLUSTRATION_STYLE,
  COMPOSITION_HOME_FEATURE,
} from "./site-image-style.mjs"
import { loadRepoEnv } from "./load-repo-env.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")
const require = createRequire(import.meta.url)

const MODELS = {
  nano: "gemini-2.5-flash-image",
  nano2: "gemini-3.1-flash-image-preview",
}

/** Order matches homepage sections; filenames are <id>.png */
const SECTION_IDS = [
  "hero",
  "qa",
  "automation",
  "complete_solutions",
  "on_time",
  "inform",
]

/** English homepage copy (sync with src/pages/en.js) — prompt context only. */
const HOME_EN = {
  heroHeader:
    "I reduce delivery risk through QA, automation, and clearer decisions in how you ship",
  heroDescription:
    "I'm an independent QA and test automation engineer (B2B, 10+ years): tests and automation aligned with your delivery process, with concise QA context for each change - scope and risk before you run full regression. Beyond execution automation, I work with teams on frequent, predictable releases.",
  sections: [
    {
      id: "qa",
      header: "What to test, before you run tests",
      lead:
        "Most tooling optimizes execution, the hard part is knowing what deserves attention. I help you tighten the gap between code changes and QA decisions - structured briefs from the pull request and its context, clearer risk and impacted areas, and fewer surprises in production. The goal is operational risk reduction, not novelty for its own sake.",
    },
    {
      id: "automation",
      header: "Automation that fits the pipeline",
      lead:
        "Maintainable frameworks for APIs and services, wired into CI/CD so feedback is continuous. Useful on its own - and the foundation when you want intelligence on failures, flakiness, and scope layered on top of the same pipelines.",
    },
    {
      id: "complete_solutions",
      header: "End-to-end quality in the lifecycle",
      lead:
        "From requirements and test design to execution and release. I integrate quality practices with your toolchain - so briefs, checks, and automation live where developers already work, not in a separate silo.",
    },
    {
      id: "on_time",
      header: "On time",
      lead:
        "Predictable cadence on contract work: clear milestones, proactive communication, and scope that matches your release train. You get fewer last-minute QA firefights and more time for the decisions that actually reduce risk.",
    },
    {
      id: "inform",
      header: "Keep you updated",
      lead:
        "Clarity at every stage: status, risk, and outcomes visible where the team already works - including alongside repository changes and pipeline output. No surprises, communication that keeps everyone aligned on progress.",
    },
  ],
}

/** Scene hints: clear metaphors, no readable text; warmer than pure diagram art. */
const SECTION_SCENES = {
  hero:
    "Delivery confidence: QA, automation, and clear decisions working together — balanced composition, a few strong shapes or a small team silhouette at modest scale; optimistic but grounded, not busy.",
  qa:
    "Choosing what to test: from many inputs to one clear focus — convergence, filters, or paths meeting; clarity and calm judgment, no labeled charts.",
  automation:
    "APIs and services woven into CI/CD — connected modules, steady flow lines, sense of continuous feedback; orderly and modern, skip gimmicky decoration.",
  complete_solutions:
    "Quality across the lifecycle: linked stages from idea to release — gentle arc or connected steps, one clear visual story at a glance, even visual weight.",
  on_time:
    "Reliable cadence: milestones and rhythm without numbers — ticks, segments, or a simple timeline abstraction; calm and in control.",
  inform:
    "Visibility for the team: status and outcomes reaching the right places — hub, channels, or soft radiating links; light and clear, no fake UI with readable text.",
}

function loadSiteMetadata() {
  const config = require(path.join(REPO_ROOT, "gatsby-config.js"))
  return config.siteMetadata || {}
}

function buildSiteContextBlock() {
  const md = loadSiteMetadata()
  const desc = (md.description || "").replace(/\s+/g, " ").trim()
  const author = md.author?.name || "Marcin Stanek"
  const siteUrl = md.siteUrl || "https://marcinstanek.pl"
  const lines = [
    `Site: ${siteUrl} — B2B independent QA and test automation contractor; author based in Poland; primary site copy is also offered in Polish.`,
    `Business summary: ${desc}`,
    `Author: ${author}.`,
    "",
    "Homepage hero (English):",
    `Headline: ${HOME_EN.heroHeader}`,
    `Intro: ${HOME_EN.heroDescription}`,
    "",
    "Feature sections (English):",
  ]
  for (const s of HOME_EN.sections) {
    lines.push(`- ${s.header}: ${s.lead}`)
  }
  lines.push(
    "",
    "Use the above only as business context. Do not paint slogans, headlines, or any readable words in the image.",
    "Visual intent: independent technical consultant — trustworthy and approachable for engineering teams, neither childish nor cold boardroom."
  )
  return lines.join("\n")
}

function homeImageDir() {
  return path.join(REPO_ROOT, "src/images/home")
}

function pngPath(id) {
  return path.join(homeImageDir(), `${id}.png`)
}

function parseArgs(argv) {
  const out = {
    section: null,
    all: false,
    prompt: null,
    model: MODELS.nano2,
    aspectRatio: "1:1",
    /** 'all' | 'none' | explicit list from --refs */
    refsMode: "all",
    refsList: null,
    printContext: false,
    delayMs: 2500,
    help: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--section" || a === "-s") out.section = argv[++i]
    else if (a === "--all") out.all = true
    else if (a === "--prompt" || a === "-p") out.prompt = argv[++i]
    else if (a === "--model" || a === "-m") out.model = argv[++i]
    else if (a === "--aspect" || a === "-a") out.aspectRatio = argv[++i]
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
        out.refsList = v.split(",").map((s) => s.trim()).filter(Boolean)
      }
    } else if (a === "--print-context") out.printContext = true
    else if (a === "--delay") out.delayMs = Number(argv[++i]) || 2500
    else if (a === "--help" || a === "-h") out.help = true
  }
  return out
}

function resolveRefIds(args, excludeId) {
  if (args.refsMode === "none") return []
  if (args.refsMode === "explicit") {
    for (const id of args.refsList) {
      if (!SECTION_IDS.includes(id)) {
        throw new Error(
          `Unknown ref id "${id}". Expected one of: ${SECTION_IDS.join(", ")}`
        )
      }
    }
    return args.refsList.filter((id) => id !== excludeId)
  }
  // all
  const missing = []
  for (const id of SECTION_IDS) {
    if (id === excludeId) continue
    if (!fs.existsSync(pngPath(id))) missing.push(id)
  }
  if (missing.length > 0) {
    throw new Error(
      `--refs all requires existing PNGs for every section except the one being generated. Missing: ${missing.join(", ")} (under ${path.relative(REPO_ROOT, homeImageDir())}). Use --refs none for a cold start, or --refs id1,id2 with files that exist.`
    )
  }
  return SECTION_IDS.filter((id) => id !== excludeId)
}

function loadReferenceParts(refIds) {
  const parts = []
  for (const id of refIds) {
    const filePath = pngPath(id)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Reference file missing: ${filePath}`)
    }
    const buf = fs.readFileSync(filePath)
    const data = buf.toString("base64")
    parts.push({ text: `Reference image (existing homepage art, file ${id}.png):` })
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

function buildScenePrompt(sectionId, overridePrompt) {
  const scene =
    overridePrompt?.trim() ||
    SECTION_SCENES[sectionId] ||
    `Professional tech / QA metaphor appropriate for section "${sectionId}".`
  return `Scene to illustrate (creative direction only):\n${scene}\n\n${SITE_ILLUSTRATION_STYLE}\n\nNote: homepage illustration beside copy for an independent QA / automation contractor — white canvas and balanced tone as below.\n\n${COMPOSITION_HOME_FEATURE}`
}

function buildContents(siteContext, refIds, sectionId, overridePrompt) {
  const prefix = buildInstructionPrefix(siteContext, refIds)
  const refParts = loadReferenceParts(refIds)
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function generateOne(ai, args, sectionId) {
  const siteContext = buildSiteContextBlock()
  const refIds = resolveRefIds(args, sectionId)
  const contents = buildContents(siteContext, refIds, sectionId, args.prompt)
  const outPath = pngPath(sectionId)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  const config = buildGenerateConfig(args.model, args.aspectRatio)
  console.error(`Model: ${args.model}`)
  console.error(`Aspect: ${args.aspectRatio}`)
  console.error(`Section: ${sectionId}`)
  console.error(`Refs: ${refIds.length ? refIds.join(", ") : "(none)"}`)
  console.error(`Output: ${path.relative(REPO_ROOT, outPath)}`)

  const response = await ai.models.generateContent({
    model: args.model,
    contents,
    config,
  })
  const buf = extractImageBuffer(response)
  fs.writeFileSync(outPath, buf)
  console.log(outPath)
}

async function main() {
  loadRepoEnv()
  const args = parseArgs(process.argv)
  if (args.help) {
    console.log(`Usage: npm run home:image -- [options]

Sections: ${SECTION_IDS.join(", ")}

Options:
  --section, -s   One section id (required unless --all)
  --all           Generate every section in order (${SECTION_IDS.join(" → ")})
  --prompt, -p    Override scene description for the current --section only
  --model, -m     ${MODELS.nano2} (default) | ${MODELS.nano} | full model id
  --aspect, -a    Aspect ratio (default: 1:1)
  --refs          all (default) | none | comma-separated ids, e.g. hero,qa
                  Default "all" requires existing PNGs for all other sections.
  --print-context Print site context + ref plan and exit (no API call)
  --delay         Milliseconds between requests when using --all (default: 2500)

Environment:
  GEMINI_API_KEY or GOOGLE_API_KEY - required unless --print-context
  Also read from repo-root .env if the file exists (does not override existing env vars).
`)
    process.exit(0)
  }

  const siteContext = buildSiteContextBlock()

  if (args.printContext) {
    console.log("=== Site context (prompt block) ===\n")
    console.log(siteContext)
    console.log("\n=== Style suffix (excerpt) ===\n")
    console.log(COMPOSITION_HOME_FEATURE)
    if (args.section) {
      console.log(`\n=== Reference plan for --section ${args.section} ===\n`)
      if (args.refsMode === "none") {
        console.log("(no reference images)")
      } else if (args.refsMode === "explicit") {
        console.log(args.refsList.join(", ") || "(empty)")
        for (const id of args.refsList) {
          const p = pngPath(id)
          console.log(`  ${id}: ${fs.existsSync(p) ? "exists" : "MISSING"} ${path.relative(REPO_ROOT, p)}`)
        }
      } else {
        const intended = SECTION_IDS.filter((id) => id !== args.section)
        for (const id of intended) {
          const p = pngPath(id)
          console.log(
            `  ${id}: ${fs.existsSync(p) ? "exists" : "MISSING"} ${path.relative(REPO_ROOT, p)}`
          )
        }
      }
      console.log("\n=== Scene prompt ===\n")
      console.log(buildScenePrompt(args.section, args.prompt))
    } else if (!args.all) {
      console.log(
        "\n(Add --section <id> to preview refs + scene, or use --all then run API separately.)"
      )
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

  if (args.section && !SECTION_IDS.includes(args.section)) {
    console.error(`Unknown section "${args.section}". Expected: ${SECTION_IDS.join(", ")}`)
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
    for (let i = 0; i < SECTION_IDS.length; i++) {
      const id = SECTION_IDS[i]
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
