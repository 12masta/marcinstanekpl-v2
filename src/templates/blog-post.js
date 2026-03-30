import * as React from "react"
import { Link, graphql } from "gatsby"

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
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        ogImage={post.frontmatter.ogImage}
        ogImageType={post.frontmatter.ogImageType}
        lang={post.frontmatter.language || `en`}
      />
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
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
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
