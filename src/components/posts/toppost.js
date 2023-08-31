import * as React from "react"

export class TopPost extends React.Component {
  render() {
    return (
      <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
        <div className="col-lg-12 px-0">
          <h1 className="display-4">{this.props.post.frontmatter.title}</h1>
          <p className="lead my-3">{this.props.post.frontmatter.description || this.props.post.excerpt}</p>
          <p className="lead mb-0"><a href={this.props.post.fields.slug} className="text-body-emphasis fw-bold">{this.props.label}</a></p>
        </div>
      </div>)
  }
}
