const path = require(`path`)

/** Map frontmatter ogImage URL/path to path under static/images (blogOgImages). */
function ogImageToListRelativePath(ogImage, siteUrl) {
  if (!ogImage || typeof ogImage !== `string`) return null
  let pathname = ogImage.trim()
  if (
    pathname.startsWith(`https://`) ||
    pathname.startsWith(`http://`)
  ) {
    const base = (siteUrl || ``).replace(/\/$/, ``)
    let siteOrigin = ``
    try {
      if (base) siteOrigin = new URL(base).origin
      const u = new URL(pathname)
      if (siteOrigin && u.origin !== siteOrigin) return null
      pathname = u.pathname
    } catch {
      return null
    }
  } else if (!pathname.startsWith(`/`)) {
    return null
  }
  if (!pathname.startsWith(`/images/`)) return null
  const rel = pathname.replace(/^\/images\//, ``)
  return rel || null
}

/** Strip /en/ or /pl/ prefix for pairing PL ↔ EN versions of the same post. */
function normalizeTranslationKey(slug) {
  if (!slug) return ``
  let s = String(slug).trim().replace(/\/+$/, ``)
  if (!s.startsWith(`/`)) s = `/${s}`
  const segments = s.split(`/`).filter(Boolean)
  if (segments[0] === `en` || segments[0] === `pl`) {
    segments.shift()
  }
  return segments.join(`/`)
}

function withTrailingSlash(p) {
  if (!p) return p
  const s = p.startsWith(`/`) ? p : `/${p}`
  return s.endsWith(`/`) ? s : `${s}/`
}

function buildTranslationMap(nodes) {
  /** @type {Map<string, { pl?: string, en?: string }>} */
  const map = new Map()

  for (const node of nodes) {
    const slug = node.fields?.slug
    if (!slug) continue
    const lang = (node.frontmatter?.language || `pl`).trim().toLowerCase()
    const explicit = node.frontmatter?.translationKey?.trim()
    const key = explicit || normalizeTranslationKey(slug)
    if (!key) continue
    if (!map.has(key)) map.set(key, {})
    const bucket = map.get(key)
    const normalizedSlug = withTrailingSlash(slug)
    if (lang === `en`) bucket.en = normalizedSlug
    else bucket.pl = normalizedSlug
  }

  return map
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { frontmatter: { date: ASC } }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
              ogImage
              ogImageType
            }
            frontmatter {
              language
              translationKey
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  const translationMap = buildTranslationMap(posts)

  if (posts.length > 0) {
    const slugPath = s =>
      String(s || ``)
        .trim()
        .replace(/^\/+|\/+$/g, ``)
    const postsEn = posts.filter(x => slugPath(x.fields.slug).startsWith(`en/`))
    const postsPl = posts.filter(x => !slugPath(x.fields.slug).startsWith(`en/`))

    createPages(postsEn, actions, translationMap)
    createPages(postsPl, actions, translationMap)
  }
}

function createPages(posts, actions, translationMap) {
  const { createPage } = actions
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  posts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id
    const nextPostId =
      index === posts.length - 1 ? null : posts[index + 1].id

    const lang = (post.frontmatter?.language || `pl`).trim().toLowerCase()
    const explicit = post.frontmatter?.translationKey?.trim()
    const key = explicit || normalizeTranslationKey(post.fields.slug)
    const pair = key ? translationMap.get(key) : null

    let alternateLanguageHref = null
    let alternateLanguageLabel = null
    if (pair) {
      if (lang === `pl` && pair.en) {
        alternateLanguageHref = pair.en
        alternateLanguageLabel = `English`
      } else if (lang === `en` && pair.pl) {
        alternateLanguageHref = pair.pl
        alternateLanguageLabel = `Polski`
      }
    }

    /** Match `trailingSlash: 'always'` (gatsby-plugin-slug paths omit the slash). */
    const pagePath = withTrailingSlash(post.fields.slug)
    createPage({
      path: pagePath,
      component: blogPost,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
        slug: pagePath,
        ogImage: post.fields.ogImage,
        ogImageType: post.fields.ogImageType,
        alternateLanguageHref,
        alternateLanguageLabel,
      },
    })
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      og: Og
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
      listOgImageFile: File
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      dateModified: Date @dateformat
      language: String
      translationKey: String
      ogImage: String
      ogImageType: String
      tags: [String]
      categories: [String]
    }

    type Fields {
      slug: String
      ogImage: String
      ogImageType: String
    }
    
    type Og {
      ogImage: String
      ogImageType: String
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemark: {
      listOgImageFile: {
        type: `File`,
        resolve: async (source, _args, context) => {
          const og = source.frontmatter?.ogImage
          const site = await context.nodeModel.findOne({ type: `Site` })
          const siteUrl = site?.siteMetadata?.siteUrl || ``
          const rel = ogImageToListRelativePath(og, siteUrl)
          if (!rel) return null
          return context.nodeModel.findOne({
            type: `File`,
            query: {
              filter: {
                sourceInstanceName: { eq: `blogOgImages` },
                relativePath: { eq: rel },
              },
            },
          })
        },
      },
    },
  })
}
