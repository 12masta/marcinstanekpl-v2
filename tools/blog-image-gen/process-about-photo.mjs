#!/usr/bin/env node
/**
 * Resize, grade, and optimize the About page portrait for marcinstanek.pl.
 * Uses sharp (same stack as gatsby-plugin-sharp) - no Gemini API.
 *
 * Visual intent is aligned with tools/blog-image-gen/site-image-style.mjs
 * (restrained B2B, calm). Rounded corners and drop shadow stay in CSS
 * (Bootstrap rounded + shadow-sm on src/pages/o-mnie.js and en/about.js).
 *
 * Defaults:
 *   Input:  brief/myself.jpg  (gitignored; pass --input if elsewhere)
 *   Output: static/images/myself.jpg
 *
 * Examples:
 *   npm run about:photo
 *   npm run about:photo -- --input ./photos/portrait.jpg --out static/images/myself.jpg
 *   npm run about:photo -- --width 960 --no-grade
 */

import { createRequire } from "node:module"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { ABOUT_PHOTO_PIPELINE } from "./site-image-style.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")
const require = createRequire(import.meta.url)
const sharp = require(`sharp`)

function parseArgs(argv) {
  const out = {
    input: path.join(REPO_ROOT, `brief`, `myself.jpg`),
    output: path.join(REPO_ROOT, `static`, `images`, `myself.jpg`),
    width: ABOUT_PHOTO_PIPELINE.maxWidth,
    grade: true,
    help: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === `--input` || a === `-i`) out.input = path.resolve(REPO_ROOT, argv[++i])
    else if (a === `--out` || a === `-o`)
      out.output = path.resolve(REPO_ROOT, argv[++i])
    else if (a === `--width` || a === `-w`) {
      const n = parseInt(argv[++i], 10)
      if (!Number.isFinite(n) || n < 320) {
        console.error(`--width must be a number >= 320`)
        process.exit(1)
      }
      out.width = n
    } else if (a === `--no-grade`) out.grade = false
    else if (a === `--help` || a === `-h`) out.help = true
  }
  return out
}

function printHelp() {
  console.log(`
process-about-photo.mjs - About page portrait for marcinstanek.pl

Options:
  --input, -i   Source image (default: brief/myself.jpg)
  --out, -o     Destination JPEG (default: static/images/myself.jpg)
  --width, -w   Max width in px, height proportional (default: ${ABOUT_PHOTO_PIPELINE.maxWidth})
  --no-grade    Skip modulate/sharpen (resize + JPEG only)
  --help, -h    This text
`)
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  if (!fs.existsSync(args.input)) {
    console.error(`Input not found: ${args.input}`)
    console.error(`Place a photo at brief/myself.jpg or pass --input <path>`)
    process.exit(1)
  }

  const outDir = path.dirname(args.output)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  let pipeline = sharp(args.input).rotate().resize({
    width: args.width,
    fit: `inside`,
    withoutEnlargement: true,
  })

  if (args.grade) {
    const { modulate, sharpen } = ABOUT_PHOTO_PIPELINE
    pipeline = pipeline
      .modulate(modulate)
      .sharpen(sharpen.sigma, sharpen.flat, sharpen.jagged)
  }

  await pipeline
    .jpeg({
      quality: ABOUT_PHOTO_PIPELINE.jpegQuality,
      mozjpeg: true,
    })
    .toFile(args.output)

  const meta = await sharp(args.output).metadata()
  const label = args.output.startsWith(REPO_ROOT + path.sep)
    ? path.relative(REPO_ROOT, args.output)
    : args.output
  console.log(
    `Wrote ${label} (${meta.width}x${meta.height}, ${ABOUT_PHOTO_PIPELINE.jpegQuality}% JPEG)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
