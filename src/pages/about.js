import * as React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useSiteTitle } from "../hooks/use-site-title"

/**
 * Common mistaken URL: /about/ → English about page (trailingSlash: always).
 */
const AboutRedirect = ({ location }) => {
  const siteTitle = useSiteTitle()

  React.useEffect(() => {
    navigate(`/en/about/`, { replace: true })
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <p className="py-4 text-body-secondary">Redirecting…</p>
    </Layout>
  )
}

export default AboutRedirect

export const Head = () => (
  <Seo
    title="About"
    lang="en"
    description=""
    meta={[{ name: `robots`, content: `noindex, nofollow` }]}
  />
)
