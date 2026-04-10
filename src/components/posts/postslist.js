import * as React from "react"

import { BlogPostListItem } from "./blog-post-list-item"

export class PostsList extends React.Component {
  render() {
    const posts = this.props.posts
    const headingId = `${this.props.id || `blog-posts-list`}-heading`
    const postCtaLabel =
      this.props.postCtaLabel != null
        ? this.props.postCtaLabel
        : "Czytaj wpis"
    const siteUrl = this.props.siteUrl || ``
    const deferThumbnailWork = this.props.deferThumbnailWork !== false

    return (
      <div
        className={`marketing last-blog-posts w-100 mb-5 home-landing-section ${this.props.className || ""}`}
        id={this.props.id || undefined}
        role="region"
        aria-labelledby={headingId}
      >
        <div className="row featurette g-0">
          <div className="col-12">
            <h2 id={headingId} className="fs-4 fw-bold mb-3">
              {this.props.label}
            </h2>
            <ol className="list-unstyled mb-0">
              {posts.map((post, index) => (
                <BlogPostListItem
                  key={post.fields.slug}
                  post={post}
                  siteUrl={siteUrl}
                  postCtaLabel={postCtaLabel}
                  isLast={index === posts.length - 1}
                  deferThumbnailWork={deferThumbnailWork}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
