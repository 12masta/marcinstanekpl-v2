import * as React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"

/** Panel width cap; input uses the same so results align with the field. */
const SEARCH_PANEL_MAX_REM = 22
const SEARCH_PANEL_EDGE_MARGIN_PX = 12

function searchLanguageFromPath(pathName) {
  if (pathName.includes("/blog/pl/")) return "pl"
  if (pathName.includes("/blog/en/")) return "en"
  if (pathName.includes("/en")) return "en"
  return "pl"
}

function normalizePostPath(slug) {
  if (!slug) return `/`
  const s = slug.startsWith(`/`) ? slug : `/${slug}`
  return s.endsWith(`/`) ? s : `${s}/`
}

const descriptionPreviewStyle = {
  overflow: `hidden`,
  display: `-webkit-box`,
  WebkitBoxOrient: `vertical`,
  WebkitLineClamp: 2,
  overflowWrap: `anywhere`,
}

function joinSearchableParts(node) {
  const fm = node.frontmatter || {}
  const tags = Array.isArray(fm.tags) ? fm.tags.join(` `) : ``
  const categories = Array.isArray(fm.categories) ? fm.categories.join(` `) : ``
  return [
    fm.title || ``,
    fm.description || ``,
    tags,
    categories,
    node.excerpt || ``,
    node.rawMarkdownBody || ``,
  ]
    .join(` `)
    .toLowerCase()
}

const query = graphql`
  query BlogNavSearchIndex {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
      nodes {
        excerpt(pruneLength: 100000, truncate: false)
        rawMarkdownBody
        fields {
          slug
        }
        frontmatter {
          title
          description
          language
          tags
          categories
        }
      }
    }
  }
`

export function BlogNavSearch({ pathName, className = `` }) {
  const data = useStaticQuery(query)
  const nodes = data.allMarkdownRemark.nodes

  const index = React.useMemo(
    () =>
      nodes.map(node => ({
        slug: node.fields.slug,
        title: node.frontmatter?.title || ``,
        description: node.frontmatter?.description || ``,
        language: (node.frontmatter?.language || `pl`).trim().toLowerCase(),
        haystack: joinSearchableParts(node),
      })),
    [nodes]
  )

  const lang = searchLanguageFromPath(pathName || ``)
  const langPosts = React.useMemo(
    () => index.filter(p => p.language === lang),
    [index, lang]
  )

  const [queryText, setQueryText] = React.useState(``)
  const [open, setOpen] = React.useState(false)
  const [dropdownLayout, setDropdownLayout] = React.useState(null)
  const rootRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const trimmed = queryText.trim()
  const tokens = React.useMemo(
    () =>
      trimmed
        .toLowerCase()
        .split(/\s+/)
        .map(t => t.trim())
        .filter(Boolean),
    [trimmed]
  )

  const results = React.useMemo(() => {
    if (tokens.length === 0) return []
    return langPosts.filter(p =>
      tokens.every(tok => p.haystack.includes(tok))
    )
  }, [langPosts, tokens])

  React.useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current || rootRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener(`mousedown`, onDocMouseDown)
    return () => document.removeEventListener(`mousedown`, onDocMouseDown)
  }, [])

  React.useLayoutEffect(() => {
    if (!open || trimmed.length === 0) {
      setDropdownLayout(null)
      return
    }

    function updateDropdownLayout() {
      const input = inputRef.current
      if (!input || typeof window === `undefined`) return

      const r = input.getBoundingClientRect()
      const margin = SEARCH_PANEL_EDGE_MARGIN_PX
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxPanelWidth = Math.min(
        SEARCH_PANEL_MAX_REM * 16,
        vw - margin * 2
      )

      let left = r.right - maxPanelWidth
      left = Math.max(margin, Math.min(left, vw - margin - maxPanelWidth))

      const top = r.bottom + margin
      const maxHeight = Math.max(140, vh - top - margin)

      setDropdownLayout({
        position: `fixed`,
        top,
        left,
        width: maxPanelWidth,
        maxHeight,
        zIndex: 1050,
        overflowY: `auto`,
        overscrollBehavior: `contain`,
        WebkitOverflowScrolling: `touch`,
        boxSizing: `border-box`,
      })
    }

    updateDropdownLayout()
    window.addEventListener(`resize`, updateDropdownLayout)
    window.addEventListener(`scroll`, updateDropdownLayout, true)
    return () => {
      window.removeEventListener(`resize`, updateDropdownLayout)
      window.removeEventListener(`scroll`, updateDropdownLayout, true)
    }
  }, [open, trimmed])

  const placeholder = lang === `en` ? `Search blog…` : `Szukaj na blogu…`
  const emptyLabel =
    lang === `en` ? `No posts match your search.` : `Brak wpisów dla tego zapytania.`

  return (
    <div
      ref={rootRef}
      className={`position-relative ${className}`.trim()}
      data-test="navbar-blog-search"
    >
      <form
        className="d-flex"
        role="search"
        aria-label={placeholder}
        onSubmit={e => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="search"
          className="form-control form-control-sm"
          style={{
            width: `min(${SEARCH_PANEL_MAX_REM}rem, calc(100vw - ${SEARCH_PANEL_EDGE_MARGIN_PX * 2}px))`,
            maxWidth: `100%`,
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          value={queryText}
          data-test="navbar-search-input"
          onChange={e => {
            setQueryText(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === `Escape`) {
              setQueryText(``)
              setOpen(false)
              inputRef.current?.blur()
            }
          }}
        />
      </form>
      {open && trimmed.length > 0 && dropdownLayout ? (
        <div
          className="list-group shadow-sm border rounded"
          style={dropdownLayout}
          role="listbox"
          aria-label={placeholder}
        >
          {results.length === 0 ? (
            <div className="list-group-item text-muted small py-2 px-3">
              {emptyLabel}
            </div>
          ) : (
            results.map(post => (
              <Link
                key={post.slug}
                to={normalizePostPath(post.slug)}
                className="list-group-item list-group-item-action py-2 px-3 text-break"
                role="option"
                onClick={() => {
                  setOpen(false)
                  setQueryText(``)
                }}
              >
                <div className="fw-medium small">{post.title}</div>
                {post.description ? (
                  <div
                    className="text-muted small"
                    style={descriptionPreviewStyle}
                  >
                    {post.description}
                  </div>
                ) : null}
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
