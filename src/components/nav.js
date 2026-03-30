import * as React from "react"
import { BlogNavSearch } from "./blog-nav-search"

export class Nav extends React.Component {
  render() {
    let brandHref
    let languageHref
    let languageLabel
    let blogHref
    let aboutHref
    let aboutLabel

    if (this.props.pathName.includes("blog/en/")) {
      brandHref = "/en/"
      languageHref = "/blog/pl/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
      aboutHref = "/en/about/"
      aboutLabel = "About"
    } else if (this.props.pathName.includes("blog/pl/")) {
      brandHref = "/"
      languageHref = "/blog/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
      aboutHref = "/o-mnie/"
      aboutLabel = "O mnie"
    } else if (this.props.pathName.includes("/en")) {
      brandHref = "/en/"
      languageHref = "/"
      languageLabel = "Polski"
      blogHref = "/blog/en/"
      aboutHref = "/en/about/"
      aboutLabel = "About"
    } else {
      brandHref = "/"
      languageHref = "/en/"
      languageLabel = "English"
      blogHref = "/blog/pl/"
      aboutHref = "/o-mnie/"
      aboutLabel = "O mnie"
    }

    if (
      this.props.alternateLanguageHref &&
      this.props.alternateLanguageLabel
    ) {
      languageHref = this.props.alternateLanguageHref
      languageLabel = this.props.alternateLanguageLabel
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
            <div className="collapse navbar-collapse flex-grow-1 align-items-lg-center" id="navbarNavAltMarkup">
              <div className="navbar-nav ms-auto align-items-lg-center">
                <div className="nav-item my-2 my-lg-0 me-lg-2">
                  <BlogNavSearch pathName={this.props.pathName} />
                </div>
                <a className="nav-link" aria-current="page" href={languageHref} data-test="navbar-language-link">{languageLabel}</a>
                <a className="nav-link" href={aboutHref} data-test="about-link">{aboutLabel}</a>
                <a className="nav-link" href={blogHref} data-test="blog-link">Blog</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
