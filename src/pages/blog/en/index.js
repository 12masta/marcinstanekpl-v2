import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../../components/layout"
import Seo from "../../../components/seo"
import { TopPost } from "../../../components/posts/toppost"
import { FeaturedPost } from "../../../components/posts/featuredpost"
import { PostsList } from "../../../components/posts/postslist"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.filter(
    post => post.frontmatter.language === "en"
  )
  const [topPost, featuredPostA, featuredPostB, ...remainingPosts] = posts


  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      {topPost ? <TopPost post={topPost} label="Continue reading" /> : null}

      {featuredPostA || featuredPostB ? (
        <div className="row mb-2">
          <div className="col-md-6">
            {featuredPostA ? (
              <FeaturedPost post={featuredPostA} label="Continue reading" />
            ) : null}
          </div>
          <div className="col-md-6">
            {featuredPostB ? (
              <FeaturedPost post={featuredPostB} label="Continue reading" />
            ) : null}
          </div>
        </div>
      ) : null}

      <PostsList
        posts={remainingPosts}
        label="Selected for you"
        postCtaLabel="Read post"
        className="mt-4"
        siteUrl={data.site.siteMetadata?.siteUrl || ``}
      />
    </Layout>
  )
}

export default BlogIndex

export const Head = () => (
  <Seo
    title="All posts"
    lang="en"
    description="English blog posts on test automation, CI/CD, Playwright, and QA practice."
    pathname="/blog/en/"
    hreflangAlternates={[
      { hreflang: `pl`, pathname: `/blog/pl/` },
      { hreflang: `en`, pathname: `/blog/en/` },
    ]}
  />
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          language
          ogImage
        }
        listOgImageFile {
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 400
              aspectRatio: 1.7777777777777777
              formats: [AUTO, WEBP, AVIF]
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
    }
  }
`
