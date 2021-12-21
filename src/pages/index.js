import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Jumbotron } from "../components/home/jumbotron"
import { LastBlogPosts } from "../components/home/lastblogbosts"
import { Featurette } from "../components/home/featurette"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.filter(post => post.frontmatter.language === "pl")

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Strona główna" />
      <Jumbotron />
      <LastBlogPosts name={"Marcin"} posts={posts}/>
      <Featurette header={"Quality Assurance"} leadText={"Poszukujesz kontrolera jakości? Potrzebujesz zautomatyzować procesy testowe w Twojej firmie? Masz problem z jakością kodu w Twojej organizacji? Trafiłeś w dobre miejsce, aby rozwiązać te problemy!"} imagePath={"../../images/home/hero.png"}/>
    </Layout>
  )
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
