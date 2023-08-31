import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../../components/layout"
import Seo from "../../../components/seo"
import { TopPost } from "../../../components/posts/toppost"
import { FeaturedPost } from "../../../components/posts/featuredpost"
import { PostsList } from "../../../components/posts/postslist"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.filter(post => post.frontmatter.language === "en")


  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts"/>
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return <Layout location={location} title={siteTitle}>
    <Seo title="All posts"/>

    <TopPost post={posts.shift()} label="Continue reading..."/>

    <div className="row mb-2">
      <div className="col-md-6">
        <FeaturedPost post={posts.shift()} label="Continue reading..." />
      </div>
      <div className="col-md-6">
        <FeaturedPost post={posts.shift()} label="Continue reading..." />
      </div>
    </div>

    <PostsList posts={posts} label="Selected for you"/>
  </Layout>
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
        }
      }
    }
  }
`
