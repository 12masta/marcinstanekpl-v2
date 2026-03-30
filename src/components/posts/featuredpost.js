import * as React from "react"
import { Link } from "gatsby"

export class FeaturedPost extends React.Component {
  render() {
    const { post, label } = this.props
    const slug = post.fields.slug

    return (
      <div className="row g-0 rounded border overflow-hidden flex-md-row mb-4 h-md-250 position-relative">
        <div className="col p-4 d-flex flex-column position-relative">
          <h2 className="mb-0">{post.frontmatter.title}</h2>
          <p className="card-text mb-auto">
            {post.frontmatter.description || post.excerpt}
          </p>
          <Link
            to={slug}
            className="icon-link gap-1 icon-link-hover stretched-link"
          >
            {label}
          </Link>
        </div>
      </div>
    )
  }
}
