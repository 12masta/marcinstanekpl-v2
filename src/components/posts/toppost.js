import * as React from "react"
import { Link } from "gatsby"

export class TopPost extends React.Component {
  render() {
    const { post, label } = this.props
    const slug = post.fields.slug

    return (
      <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary position-relative">
        <div className="col-lg-12 px-0">
          <h1 className="display-4">{post.frontmatter.title}</h1>
          <p className="lead my-3">
            {post.frontmatter.description || post.excerpt}
          </p>
          <p className="lead mb-0">
            <Link
              to={slug}
              className="fw-bold stretched-link text-body-emphasis icon-link icon-link-hover"
            >
              {label}
            </Link>
          </p>
        </div>
      </div>
    )
  }
}
