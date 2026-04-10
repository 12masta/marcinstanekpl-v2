import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { QaPrBriefsLanding } from "../components/landing/qa-pr-briefs-landing"
import { qaPrBriefsLandingCopy } from "../data/qa-pr-briefs-landing-copy"
import { useSiteTitle } from "../hooks/use-site-title"

const copy = qaPrBriefsLandingCopy.pl

const QaBriefingiPrPl = ({ location }) => {
  const siteTitle = useSiteTitle()

  return (
    <Layout
      location={location}
      title={siteTitle}
      alternateLanguageHref="/en/qa-pr-briefs/"
      alternateLanguageLabel="English"
    >
      <QaPrBriefsLanding copy={copy} />
    </Layout>
  )
}

export default QaBriefingiPrPl

export const Head = () => (
  <Seo
    title={copy.documentTitle}
    lang="pl"
    description={copy.metaDescription}
    pathname="/qa-briefingi-pr/"
    hreflangAlternates={[
      { hreflang: `pl`, pathname: `/qa-briefingi-pr/` },
      { hreflang: `en`, pathname: `/en/qa-pr-briefs/` },
    ]}
  />
)
