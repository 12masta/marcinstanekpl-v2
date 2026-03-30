const path = require(`path`)

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

    createPage({
      path: post.fields.slug,
      component: blogPost,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
        slug: post.fields.slug,
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
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      language: String
      translationKey: String
      ogImage: String
      ogImageType: String
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
