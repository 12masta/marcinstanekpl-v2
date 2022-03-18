import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Headlines } from "../components/common/headlines"

const ThankYouPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Pobierz dokument" />
      <Headlines
        header="Dziękuję za pobranie!"
        lead="Dokument znajdziesz za chwilę na swojej skrzynce mailowej lub możesz
            go pobrać klikając poniżej"
      />
      <div className="d-grid gap-2">
        <a
          className="d-grid gap-2"
          href="https://drive.google.com/open?id=1B6nrOkUFhANoV4AZqyO8duPR5sKPhI92"
        >
          <button
            className="btn btn-primary text-uppercase btn-lg"
            type="button"
          >
            Pobierz
          </button>
        </a>
      </div>
    </Layout>
  )
}

export default ThankYouPage

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
