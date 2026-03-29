import * as fs from "fs"
import * as path from "path"

const BLOG_ROOT = path.join(__dirname, "..", "..", "content", "blog")

/**
 * Paths match gatsby-plugin-slug + trailingSlash: always (e.g. `/en/foo/`).
 * Derived from markdown frontmatter so tests stay aligned with built routes.
 */
export function getBlogPostPaths(): string[] {
  const paths = new Set<string>()

  function walk(dir: string) {
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
        if (!slugMatch) continue
        let slug = slugMatch[1].trim()
        slug = slug.replace(/^["']|["']$/g, "")
        slug = slug.replace(/^\/+|\/+$/g, "")
        if (!slug) continue
        paths.add(`/${slug}/`)
      }
    }
  }

  if (fs.existsSync(BLOG_ROOT)) {
    walk(BLOG_ROOT)
  }

  return [...paths].sort((a, b) => a.localeCompare(b))
}
