import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Headlines } from "../components/common/headlines"
import { MailingSection } from "../components/common/mailingsection"

const SeleniumRecruitmentTask = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="16 RZECZY, KTÓRE MUSISZ WIEDZIEĆ, ABY SKUTECZNIE ZAUTOMATYZOWAĆ TESTY" />
      <Headlines
        header="WEŹ ZA DARMO!"
        lead="16 RZECZY, KTÓRE MUSISZ WIEDZIEĆ, ABY SKUTECZNIE ZAUTOMATYZOWAĆ
                TESTY oraz lista bibliotek, z których korzystam w każdym moim
                projekcie testowym"
      />
      <MailingSection
        text="TAK! Chcę!"
        endpoint="/createorupdatecontact"
        redirectionUrl="/dziekuje/"
      />
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
