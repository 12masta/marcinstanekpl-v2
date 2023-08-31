import * as React from "react"

export class FeaturedPost extends React.Component {
  render() {
    return (
          <div className="row g-0 rounded border overflow-hidden flex-md-row mb-4 h-md-250 position-relative">
            <div className="col p-4 d-flex flex-column position-static">
              <h2 className="mb-0">{this.props.post.frontmatter.title}</h2>
              <p className="card-text mb-auto">{this.props.post.frontmatter.description || this.props.post.excerpt}</p>
              <a href={this.props.post.fields.slug} className="icon-link gap-1 icon-link-hover stretched-link">
                {this.props.label}
              </a>
            </div>
          </div>)
  }
}