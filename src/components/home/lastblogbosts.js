import * as React from "react"

import { BlogPostListItem } from "../posts/blog-post-list-item"

export class LastBlogPosts extends React.Component {


  render() {
    const posts = this.props.posts
    const postCtaLabel =
      this.props.postCtaLabel != null
        ? this.props.postCtaLabel
        : "Czytaj wpis"
    const siteUrl = this.props.siteUrl || ``

    return (
      <div
        className="marketing last-blog-posts mb-5 home-landing-section"
        id="ostatnie-wpisy"
      >
        <div className="row featurette">
          <div className="col-12">
            <h2 className="fs-4 fw-bold mb-3">{this.props.header}</h2>
            <ol className="list-unstyled mb-0">
              {posts.map((post, index) => (
                <BlogPostListItem
                  key={post.fields.slug}
                  post={post}
                  siteUrl={siteUrl}
                  postCtaLabel={postCtaLabel}
                  isLast={index === posts.length - 1}
                  deferThumbnailWork
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
