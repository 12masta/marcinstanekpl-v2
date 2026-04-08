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
    post => post.frontmatter.language === "pl"
  )
  const [topPost, featuredPostA, featuredPostB, ...remainingPosts] = posts


  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          Nie znaleziono wpisow blogowych. Dodaj wpisy markdown w "content/blog"
          (lub katalog wskazany w pluginie "gatsby-source-filesystem" w
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      {topPost ? <TopPost post={topPost} label="Kontynuuj czytanie" /> : null}

      {featuredPostA || featuredPostB ? (
        <div className="row mb-2">
          <div className="col-md-6">
            {featuredPostA ? (
              <FeaturedPost post={featuredPostA} label="Kontynuuj czytanie" />
            ) : null}
          </div>
          <div className="col-md-6">
            {featuredPostB ? (
              <FeaturedPost post={featuredPostB} label="Kontynuuj czytanie" />
            ) : null}
          </div>
        </div>
      ) : null}

      <PostsList
        posts={remainingPosts}
        label="Wybrane dla Ciebie"
        postCtaLabel="Czytaj wpis"
        className="mt-4"
        siteUrl={data.site.siteMetadata?.siteUrl || ``}
      />
    </Layout>
  )
}

export default BlogIndex

export const Head = () => <Seo title="Wszystkie wpisy" lang="pl" />

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
