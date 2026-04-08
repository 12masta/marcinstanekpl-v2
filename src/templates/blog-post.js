import * as React from "react"
import { Link, graphql } from "gatsby"
import "prismjs/themes/prism.css"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { blogOgImageSrc } from "../utils/blog-og-image-src"

const BlogPostTemplate = ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteUrl = data.site.siteMetadata?.siteUrl || ``
  const { previous, next } = data
  const bannerSrc = blogOgImageSrc(post.frontmatter.ogImage, siteUrl)

  return (
    <Layout
      location={location}
      title={siteTitle}
      alternateLanguageHref={pageContext.alternateLanguageHref || undefined}
      alternateLanguageLabel={pageContext.alternateLanguageLabel || undefined}
    >
      <div className="container mt-4">
        <article
          className="blog-post"
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <h1 className="display-5 fw-bold" itemProp="headline">
              {post.frontmatter.title}
            </h1>
            {bannerSrc ? (
              <figure className="blog-post-banner">
                <img
                  src={bannerSrc}
                  alt={post.frontmatter.title}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
              </figure>
            ) : null}
          </header>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
          <hr />
        </article>

        <nav className="blog-post-nav">
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

function toIso8601(value) {
  if (value == null || value === ``) return ``
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? `` : d.toISOString()
}

function withTrailingSlash(p) {
  if (!p) return ``
  const s = p.startsWith(`/`) ? p : `/${p}`
  return s.endsWith(`/`) ? s : `${s}/`
}

export const Head = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const siteUrl = data.site.siteMetadata.siteUrl?.replace(/\/$/, ``) || ``
  const slug = pageContext?.slug || post.fields?.slug || ``
  const lang = (post.frontmatter.language || `pl`).trim().toLowerCase()
  const altPath = pageContext?.alternateLanguageHref || ``

  const hreflangAlternates = []
  if (slug) {
    hreflangAlternates.push({
      hreflang: lang === `en` ? `en` : `pl`,
      pathname: slug,
    })
  }
  if (altPath) {
    hreflangAlternates.push({
      hreflang: lang === `en` ? `pl` : `en`,
      pathname: altPath,
    })
  }

  const publishedIso = toIso8601(post.frontmatter.dateISO)
  const modifiedIso = toIso8601(post.frontmatter.dateModifiedISO) || publishedIso

  const canonicalUrl = slug ? `${siteUrl}${withTrailingSlash(slug)}` : ``
  const authorName = data.site.siteMetadata.author?.name || `Marcin Stanek`

  const defaultOg = data.site.siteMetadata.og?.ogImage || `/ogImage.jpg`
  const rawOg = post.frontmatter.ogImage
  const jsonLdImage = (() => {
    if (!rawOg) return `${siteUrl}${defaultOg.startsWith(`/`) ? defaultOg : `/${defaultOg}`}`
    if (rawOg.startsWith(`https://`) || rawOg.startsWith(`http://`)) return rawOg
    if (rawOg.startsWith(`/`)) return `${siteUrl}${rawOg}`
    return rawOg
  })()

  const jsonLd =
    canonicalUrl && publishedIso
      ? JSON.stringify({
          "@context": `https://schema.org`,
          "@type": `BlogPosting`,
          headline: post.frontmatter.title,
          image: [jsonLdImage],
          datePublished: publishedIso,
          dateModified: modifiedIso,
          author: {
            "@type": `Person`,
            name: authorName,
          },
          mainEntityOfPage: {
            "@type": `WebPage`,
            "@id": canonicalUrl,
          },
        })
      : ``

  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      ogImage={post.frontmatter.ogImage}
      ogImageType={post.frontmatter.ogImageType}
      lang={lang === `en` ? `en` : `pl`}
      pathname={slug ? withTrailingSlash(slug) : ``}
      hreflangAlternates={hreflangAlternates.length > 1 ? hreflangAlternates : null}
      ogType="article"
      articlePublishedTime={publishedIso}
      articleModifiedTime={modifiedIso}
      jsonLd={jsonLd}
    />
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
        author {
          name
        }
        og {
          ogImage
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        dateISO: date
        dateModifiedISO: dateModified
        description
        ogImage
        ogImageType
        language
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
