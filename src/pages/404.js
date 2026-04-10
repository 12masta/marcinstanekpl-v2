import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <div className="py-4">
        <h1 className="fs-2 fw-bold mb-3">404: Not Found</h1>
        <p className="mb-0">You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => (
  <Seo
    title="404: Not Found"
    meta={[{ name: `robots`, content: `noindex, nofollow` }]}
  />
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
