import * as fs from "fs"
import * as path from "path"

const BLOG_ROOT = path.join(__dirname, "..", "..", "content", "blog")

export function normalizeTranslationKey(slugPath: string): string {
  let s = slugPath.trim().replace(/\/+$/, "")
  if (!s.startsWith("/")) s = `/${s}`
  const segments = s.split("/").filter(Boolean)
  if (segments[0] === "en" || segments[0] === "pl") {
    segments.shift()
  }
  return segments.join("/")
}

function withTrailingSlash(p: string): string {
  const s = p.startsWith("/") ? p : `/${p}`
  return s.endsWith("/") ? s : `${s}/`
}

/**
 * Pairs of PL and EN post URLs (with trailing slash), mirroring gatsby-node buildTranslationMap.
 */
export function getBlogTranslationPairs(): { pl: string; en: string }[] {
  const groups = new Map<string, { pl?: string; en?: string }>()

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        walk(full)
      } else if (
        ent.isFile() &&
        (ent.name.endsWith(".markdown") || ent.name.endsWith(".md"))
      ) {
        const raw = fs.readFileSync(full, "utf8")
        const slugMatch = raw.match(/^slug:\s*(.+)$/m)
        const langMatch = raw.match(/^language:\s*(\w+)/m)
        if (!slugMatch) continue
        let slug = slugMatch[1].trim().replace(/^["']|["']$/g, "").trim()
        slug = slug.replace(/^\/+|\/+$/g, "")
        if (!slug) continue
        const lang = (langMatch?.[1] || "pl").trim().toLowerCase()
        const keyMatch = raw.match(/^translationKey:\s*(.+)$/m)
        const explicit = keyMatch?.[1]?.trim().replace(/^["']|["']$/g, "")
        const key = explicit || normalizeTranslationKey(`/${slug}`)
        if (!key) continue
        if (!groups.has(key)) groups.set(key, {})
        const bucket = groups.get(key)!
        const url = withTrailingSlash(`/${slug}`)
        if (lang === "en") bucket.en = url
        else bucket.pl = url
      }
    }
  }

  walk(BLOG_ROOT)

  const pairs: { pl: string; en: string }[] = []
  for (const [, v] of groups) {
    if (v.pl && v.en) pairs.push({ pl: v.pl, en: v.en })
  }
  return pairs.sort((a, b) => a.pl.localeCompare(b.pl))
}
