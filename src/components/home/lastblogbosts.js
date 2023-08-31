import * as React from "react"
import { Link } from "gatsby"

export class LastBlogPosts extends React.Component {


  render() {
    return (
      <div className="container ">
        <h2 className="text-center">{this.props.header}</h2>
        <ol className="p-1" style={{ listStyle: `none` }}>
          {this.props.posts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h3>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title} &raquo;</span>
                      </Link>
                    </h3>
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
            )
          })}
        </ol>
      </div>)

  }
}
