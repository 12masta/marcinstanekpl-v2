import * as React from "react"

export class Nav extends React.Component {
  render() {
    console.log(this.props.pathName)
    let languageHref
    let languageLabel
    let blogHref

    if (this.props.pathName.includes("blog/en/")) {
      languageHref = "/blog/pl/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
    } else if (this.props.pathName.includes("blog/pl/")) {
      languageHref = "/blog/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
    } else if (this.props.pathName.includes("/en")) {
      languageHref = "/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
    } else {
      languageHref = "/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
    }

    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">marcinstanek.pl</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-link" aria-current="page" href={languageHref}>{languageLabel}</a>
                <a className="nav-link" href={blogHref}>Blog</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
