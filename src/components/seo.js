/**
 * SEO for Gatsby Head API (replaces react-helmet).
 * Use only inside `export const Head` from pages/templates.
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, lang, meta, title, ogImage, ogImageType }) => {
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

  const metaList = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata?.social?.twitter || ``,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
    {
      name: `og:image`,
      content: metaOgImage,
      id: `og:image`,
    },
    {
      name: `og:image:type`,
      content: metaOgImageType,
      id: `og:image:type`,
    },
  ].concat(meta)

  return (
    <>
      <html lang={lang} />
      <title>{documentTitle}</title>
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
    </>
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default Seo
