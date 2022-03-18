import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Hero } from "../components/recruitmenttask/hero"
import { ThankYou } from "../components/recruitmenttask/thankyou"
import { MailingSection } from "../components/common/mailingsection"

const SeleniumRecruitmentTask = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Rozwiązanie zadania rekrutacyjnego na podstawie Selenium WebDriver" />
      <Hero videoLink="https://player.vimeo.com/video/386467595" />
      <MailingSection
        text="Chcę zobaczyć rozwiązanie!
                            &raquo;"
        endpoint="/createorupdatecontactseleniumwebdriverhomework"
        redirectionUrl="/selenium-zadanie-rekrutacyjne-dziekuje/"
      />
      <ThankYou />
    </Layout>
  )
}

export default SeleniumRecruitmentTask

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
