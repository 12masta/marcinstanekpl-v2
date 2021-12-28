import * as React from "react"

export class Nav extends React.Component {
  render() {
    console.log(this.props.pathName)

    let brandHref
    let languageHref
    let languageLabel
    let blogHref

    if (this.props.pathName.includes("blog/en/")) {
      brandHref = "/en/"
      languageHref = "/blog/pl/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
    } else if (this.props.pathName.includes("blog/pl/")) {
      brandHref = "/"
      languageHref = "/blog/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
    } else if (this.props.pathName.includes("/en")) {
      brandHref = "/en/"
      languageHref = "/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
    } else {
      brandHref = "/"
      languageHref = "/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
    }

    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light" data-test="navbar">
          <div className="container-fluid">
            <a className="navbar-brand" data-test="navbar-brand" href={brandHref}>marcinstanek.pl</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation" data-test="navbar-toggler">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-link" aria-current="page" href={languageHref} data-test="navbar-language-link">{languageLabel}</a>
                <a className="nav-link" href={blogHref} data-test="blog-link">Blog</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
