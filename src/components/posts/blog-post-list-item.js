import * as React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { blogOgImageSrc } from "../../utils/blog-og-image-src"
import { ChevronRightIcon } from "./chevron-right-icon"

export function BlogPostListItem({
  post,
  siteUrl = ``,
  postCtaLabel,
  isLast,
}) {
  const slug = post.fields.slug
  const title = post.frontmatter.title || slug
  const imgSrc = blogOgImageSrc(post.frontmatter?.ogImage, siteUrl)
  const listGatsbyImage =
    post.listOgImageFile && getImage(post.listOgImageFile)
  const showThumbColumn = Boolean(imgSrc || listGatsbyImage)
  const textColClass = showThumbColumn
    ? `col-12 col-sm-8 col-lg-9`
    : `col-12`

  return (
    <li
      className={
        isLast ? `mb-0` : `mb-4 pb-4 border-bottom border-secondary-subtle`
      }
    >
      <article
        className="post-list-item px-3 py-3 rounded-3"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div className="row g-3 g-md-4 align-items-start">
          {showThumbColumn ? (
            <div className="col-12 col-sm-4 col-lg-3">
              <Link
                to={slug}
                className="d-block ratio ratio-16x9 rounded-2 overflow-hidden bg-body-secondary shadow-sm"
                tabIndex={-1}
                aria-hidden="true"
              >
                {listGatsbyImage ? (
                  <GatsbyImage
                    image={listGatsbyImage}
                    alt=""
                    loading="lazy"
                    objectFit="cover"
                    className="h-100 w-100"
                  />
                ) : (
                  <img
                    src={imgSrc}
                    alt=""
                    className="object-fit-cover"
                    loading="lazy"
                    decoding="async"
                    itemProp="image"
                  />
                )}
              </Link>
            </div>
          ) : null}
          <div className={textColClass}>
            <header>
              <h3 className="h5 mb-2">
                <Link
                  to={slug}
                  className="icon-link icon-link-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold text-body-emphasis d-flex flex-nowrap align-items-center gap-2 w-100"
                  itemProp="url"
                >
                  <span
                    className="min-w-0 flex-grow-1 text-break"
                    itemProp="headline"
                  >
                    {title}
                  </span>
                  <ChevronRightIcon />
                </Link>
              </h3>
            </header>
            <section>
              <p
                className="mb-0 text-body-secondary"
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
                itemProp="description"
              />
            </section>
            <p className="mb-0 mt-3">
              <Link
                to={slug}
                className="icon-link icon-link-hover small fw-semibold text-decoration-none d-inline-flex flex-nowrap align-items-center gap-1"
              >
                {postCtaLabel}
                <ChevronRightIcon />
              </Link>
            </p>
          </div>
        </div>
      </article>
    </li>
  )
}
