import * as React from "react"
import { Link } from "gatsby"

export class PostsList extends React.Component {
  render() {
    return (<div className="row g-5">
      <div className="col-md-12">
        <h3 className="pb-4 mb-4 border-bottom fs-4 fw-semibold">
          {this.props.label}
        </h3>
        <ol className="p-1" style={{ listStyle: `none` }}>
          {this.props.posts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2 className="fs-5 fw-semibold">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          })}
        </ol>
      </div>
    </div>)
  }
}