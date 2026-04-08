/**
 * SEO for Gatsby Head API (replaces react-helmet).
 * Use only inside `export const Head` from pages/templates.
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

function withTrailingSlash(p) {
  if (!p) return ``
  const s = p.startsWith(`/`) ? p : `/${p}`
  return s.endsWith(`/`) ? s : `${s}/`
}

function toAbsoluteUrl(siteUrl, pathname) {
  const base = siteUrl?.replace(/\/$/, ``) || ``
  return `${base}${withTrailingSlash(pathname)}`
}

function hreflangWithXDefault(alternates) {
  if (!alternates?.length) return []
  const hasPl = alternates.some(a => a.hreflang === `pl`)
  const hasEn = alternates.some(a => a.hreflang === `en`)
  if (hasPl && hasEn) {
    const pl = alternates.find(a => a.hreflang === `pl`)
    if (pl && !alternates.some(a => a.hreflang === `x-default`)) {
      return [...alternates, { hreflang: `x-default`, pathname: pl.pathname }]
    }
  }
  return [...alternates]
}

const Seo = ({
  description,
  lang,
  meta,
  title,
  ogImage,
  ogImageType,
  pathname = ``,
  hreflangAlternates = null,
  ogType = `website`,
  articlePublishedTime = ``,
  articleModifiedTime = ``,
  jsonLd = ``,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            social {
              twitter
            }
            og {
              ogImage
              ogImageType
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const documentTitle =
    defaultTitle && title ? `${title} | ${defaultTitle}` : title || defaultTitle || ``

  const siteUrl = site.siteMetadata.siteUrl?.replace(/\/$/, ``) || ``
  const metaOgImage = (() => {
    const raw = ogImage
    const fallback = site.siteMetadata.og.ogImage
    if (!raw) return siteUrl + fallback
    if (raw.startsWith(`https://`) || raw.startsWith(`http://`)) return raw
    if (raw.startsWith(`/`)) return siteUrl + raw
    return raw
  })()
  const metaOgImageType = ogImageType || site.siteMetadata.og.ogImageType

  const canonicalUrl = pathname ? toAbsoluteUrl(siteUrl, pathname) : ``

  const resolvedOgType = ogType || `website`
  const twitterCard =
    resolvedOgType === `article` ? `summary_large_image` : `summary`

  const openGraphMeta = [
    { property: `og:title`, content: title },
    { property: `og:description`, content: metaDescription },
    { property: `og:type`, content: resolvedOgType },
  ]
  if (canonicalUrl) {
    openGraphMeta.push({ property: `og:url`, content: canonicalUrl })
  }
  if (articlePublishedTime) {
    openGraphMeta.push({
      property: `article:published_time`,
      content: articlePublishedTime,
    })
  }
  if (articleModifiedTime) {
    openGraphMeta.push({
      property: `article:modified_time`,
      content: articleModifiedTime,
    })
  }
  openGraphMeta.push(
    {
      property: `og:image`,
      content: metaOgImage,
      id: `og:image`,
    },
    {
      property: `og:image:type`,
      content: metaOgImageType,
      id: `og:image:type`,
    }
  )

  const twitterMeta = [
    { name: `twitter:card`, content: twitterCard },
    {
      name: `twitter:creator`,
      content: site.siteMetadata?.social?.twitter || ``,
    },
    { name: `twitter:title`, content: title },
    { name: `twitter:description`, content: metaDescription },
    { name: `twitter:image`, content: metaOgImage },
  ]

  const descriptionMeta = [{ name: `description`, content: metaDescription }]

  const metaList = descriptionMeta
    .concat(openGraphMeta)
    .concat(twitterMeta)
    .concat(meta || [])

  const alternates = hreflangWithXDefault(hreflangAlternates || [])

  return (
    <>
      <html lang={lang} />
      <title>{documentTitle}</title>
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {alternates.map((alt, i) => (
        <link
          key={`${alt.hreflang}-${i}`}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={toAbsoluteUrl(siteUrl, alt.pathname)}
        />
      ))}
      {metaList.map((tag, i) => {
        const key = tag.name || tag.property || i
        if (tag.name) {
          return (
            <meta
              key={`${key}-${i}`}
              name={tag.name}
              content={tag.content}
              id={tag.id}
            />
          )
        }
        if (tag.property) {
          return (
            <meta
              key={`${key}-${i}`}
              property={tag.property}
              content={tag.content}
              id={tag.id}
            />
          )
        }
        return null
      })}
      {jsonLd ? (
        <script type="application/ld+json">{jsonLd}</script>
      ) : null}
    </>
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  pathname: ``,
  hreflangAlternates: null,
  ogType: `website`,
  articlePublishedTime: ``,
  articleModifiedTime: ``,
  jsonLd: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  ogImage: PropTypes.string,
  ogImageType: PropTypes.string,
  pathname: PropTypes.string,
  hreflangAlternates: PropTypes.arrayOf(
    PropTypes.shape({
      hreflang: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    })
  ),
  ogType: PropTypes.string,
  articlePublishedTime: PropTypes.string,
  articleModifiedTime: PropTypes.string,
  jsonLd: PropTypes.string,
}

export default Seo
