#!/usr/bin/env node
/**
 * Set ogImage / ogImageType from slug when static/images/blog/<slug>/og.png exists.
 * Removes legacy ogimage / ogimagetype lines. Idempotent for already-correct posts.
 */
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../..")
const SITE = "https://marcinstanek.pl"

function walkBlogMarkdown(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkBlogMarkdown(p, acc)
    else if (ent.name.endsWith(".markdown")) acc.push(p)
  }
  return acc
}

function parseFrontmatterBlock(md) {
  if (!md.startsWith("---")) return null
  const end = md.indexOf("\n---", 3)
  if (end === -1) return null
  return { block: md.slice(3, end), rest: md.slice(end) }
}

function getSlug(block) {
  const m = block.match(/^slug:\s*(.+)$/m)
  if (!m) return null
  let v = m[1].trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  return v.trim()
}

/** EN posts use slug `en/cypress-0`; assets live under static/images/blog/cypress-0/. */
function diskSlugFromFrontmatterSlug(slug) {
  if (slug.startsWith("en/")) return slug.slice(3).trim()
  return slug
}

function syncFile(filePath) {
  const md = fs.readFileSync(filePath, "utf8")
  const parsed = parseFrontmatterBlock(md)
  if (!parsed) return false
  const slug = getSlug(parsed.block)
  if (!slug) return false
  const diskSlug = diskSlugFromFrontmatterSlug(slug)
  if (!diskSlug) return false
  const png = path.join(REPO_ROOT, "static/images/blog", diskSlug, "og.png")
  if (!fs.existsSync(png)) return false

  const ogUrl = `${SITE}/images/blog/${diskSlug}/og.png`
  let lines = parsed.block.split("\n")
  lines = lines.filter(
    (l) =>
      !/^ogimage\s*:/i.test(l) &&
      !/^ogimagetype\s*:/i.test(l) &&
      !/^ogImage\s*:/.test(l) &&
      !/^ogImageType\s*:/.test(l)
  )
  let insertIdx = 0
  for (let i = 0; i < lines.length; i++) {
    if (/^slug:\s/.test(lines[i])) {
      insertIdx = i + 1
      break
    }
  }
  lines.splice(insertIdx, 0, `ogImage: ${ogUrl}`, `ogImageType: image/png`)
  const newMd = `---${lines.join("\n")}${parsed.rest}`
  if (newMd !== md) {
    fs.writeFileSync(filePath, newMd)
    return true
  }
  return false
}

const dir = path.join(REPO_ROOT, "content/blog")
let n = 0
for (const f of walkBlogMarkdown(dir)) {
  if (syncFile(f)) {
    console.log(path.relative(REPO_ROOT, f))
    n++
  }
}
console.error(`Updated ${n} file(s).`)
