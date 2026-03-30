import * as React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"

/** Panel width cap; input uses the same so results align with the field. */
const SEARCH_PANEL_MAX_REM = 22
const SEARCH_PANEL_EDGE_MARGIN_PX = 12
const SEARCH_REVEAL_MS = 320

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
  const [searchMounted, setSearchMounted] = React.useState(false)
  const [searchExpanded, setSearchExpanded] = React.useState(false)
  const [dropdownLayout, setDropdownLayout] = React.useState(null)
  const rootRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const closeTimerRef = React.useRef(null)

  const openSearchPanel = React.useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setSearchMounted(true)
    window.requestAnimationFrame(() => setSearchExpanded(true))
  }, [])

  const closeSearchPanel = React.useCallback(() => {
    setSearchExpanded(false)
    setOpen(false)
    setQueryText(``)
    setDropdownLayout(null)
    closeTimerRef.current = window.setTimeout(() => {
      setSearchMounted(false)
      closeTimerRef.current = null
    }, SEARCH_REVEAL_MS)
  }, [])

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
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  React.useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current || rootRef.current.contains(e.target)) return
      if (searchMounted) closeSearchPanel()
      else setOpen(false)
    }
    document.addEventListener(`mousedown`, onDocMouseDown)
    return () => document.removeEventListener(`mousedown`, onDocMouseDown)
  }, [searchMounted, closeSearchPanel])

  React.useEffect(() => {
    if (!searchMounted || !searchExpanded) return undefined
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [searchMounted, searchExpanded])

  React.useLayoutEffect(() => {
    if (!searchMounted || !searchExpanded || !open || trimmed.length === 0) {
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
  }, [searchMounted, searchExpanded, open, trimmed])

  const placeholder = lang === `en` ? `Search blog…` : `Szukaj na blogu…`
  const emptyLabel =
    lang === `en` ? `No posts match your search.` : `Brak wpisów dla tego zapytania.`
  const searchNavLabel = lang === `en` ? `Search` : `Szukaj`

  const fieldWidth = `min(${SEARCH_PANEL_MAX_REM}rem, calc(100vw - ${SEARCH_PANEL_EDGE_MARGIN_PX * 2}px))`
  const revealTransition = `max-width ${SEARCH_REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${Math.round(
    SEARCH_REVEAL_MS * 0.65
  )}ms ease`
  /** Match stacked .nav-link block height so opening search does not shift navbar (esp. mobile). */
  const searchRowMinHeight = `calc(2 * var(--bs-nav-link-padding-y, 0.5rem) + 1.5em)`

  return (
    <div
      ref={rootRef}
      className={`d-flex align-items-center flex-nowrap w-100 w-lg-auto ${className}`.trim()}
      style={{ minHeight: searchRowMinHeight }}
      data-test="navbar-blog-search"
    >
      {!searchMounted ? (
        <button
          type="button"
          className="nav-link border-0 bg-transparent text-start w-100 w-lg-auto"
          data-test="navbar-search-toggle"
          aria-expanded="false"
          aria-controls="navbar-blog-search-input"
          onClick={openSearchPanel}
        >
          {searchNavLabel}
        </button>
      ) : (
        <div
          className="overflow-hidden w-100 w-lg-auto d-flex align-items-center"
          style={{
            maxWidth: searchExpanded ? `${SEARCH_PANEL_MAX_REM}rem` : 0,
            opacity: searchExpanded ? 1 : 0,
            transition: revealTransition,
            pointerEvents: searchExpanded ? `auto` : `none`,
          }}
        >
          <form
            className="d-flex align-items-center w-100 mb-0"
            role="search"
            aria-label={placeholder}
            onSubmit={e => e.preventDefault()}
          >
            <input
              ref={inputRef}
              id="navbar-blog-search-input"
              type="search"
              className="form-control form-control-sm"
              style={{
                width: fieldWidth,
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
                  e.preventDefault()
                  closeSearchPanel()
                }
              }}
            />
          </form>
        </div>
      )}
      {searchMounted &&
      searchExpanded &&
      open &&
      trimmed.length > 0 &&
      dropdownLayout ? (
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
                  closeSearchPanel()
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
