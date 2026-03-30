import { useStaticQuery, graphql } from "gatsby"

export function useSiteTitle() {
  const data = useStaticQuery(graphql`
    query AboutPagesSiteTitle {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return data.site?.siteMetadata?.title || `Title`
}
