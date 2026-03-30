import * as React from "react"
import { Link } from "gatsby"

import { ChevronRightIcon } from "./chevron-right-icon"

export class PostsList extends React.Component {
  render() {
    const posts = this.props.posts
    const postCtaLabel =
      this.props.postCtaLabel != null
        ? this.props.postCtaLabel
        : "Czytaj wpis"

    return (
      <div
        className={`marketing last-blog-posts w-100 ${this.props.className || ""}`}
        id={this.props.id || undefined}
      >
        <hr className="featurette-divider" />
        <div className="row featurette g-0">
          <div className="col-12">
            <h2 className="featurette-heading display-6 fw-light mb-4">
              {this.props.label}
            </h2>
            <ol className="list-unstyled mb-0">
              {posts.map((post, index) => {
                const title = post.frontmatter.title || post.fields.slug
                const isLast = index === posts.length - 1

                return (
                  <li
                    key={post.fields.slug}
                    className={
                      isLast
                        ? "mb-0"
                        : "mb-4 pb-4 border-bottom border-secondary-subtle"
                    }
                  >
                    <article
                      className="post-list-item px-3 py-3 rounded-3"
                      itemScope
                      itemType="http://schema.org/Article"
                    >
                      <header>
                        <h3 className="h5 mb-2">
                          <Link
                            to={post.fields.slug}
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
                          to={post.fields.slug}
                          className="icon-link icon-link-hover small fw-semibold text-decoration-none d-inline-flex flex-nowrap align-items-center gap-1"
                        >
                          {postCtaLabel}
                          <ChevronRightIcon />
                        </Link>
                      </p>
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
