import * as React from "react"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { QaPrBriefsLanding } from "../../components/landing/qa-pr-briefs-landing"
import { qaPrBriefsLandingCopy } from "../../data/qa-pr-briefs-landing-copy"
import { useSiteTitle } from "../../hooks/use-site-title"

const copy = qaPrBriefsLandingCopy.en

const QaPrBriefsEn = ({ location }) => {
  const siteTitle = useSiteTitle()

  return (
    <Layout
      location={location}
      title={siteTitle}
      alternateLanguageHref="/qa-briefingi-pr/"
      alternateLanguageLabel="Polski"
    >
      <QaPrBriefsLanding copy={copy} />
    </Layout>
  )
}

export default QaPrBriefsEn

export const Head = () => (
  <Seo
    title={copy.documentTitle}
    lang="en"
    description={copy.metaDescription}
    pathname="/en/qa-pr-briefs/"
    hreflangAlternates={[
      { hreflang: `pl`, pathname: `/qa-briefingi-pr/` },
      { hreflang: `en`, pathname: `/en/qa-pr-briefs/` },
    ]}
  />
)
