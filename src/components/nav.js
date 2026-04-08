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
              <div className="navbar-nav ms-auto align-items-lg-center flex-nowrap gap-lg-1">
                <a className="nav-link text-nowrap flex-shrink-0" href={aboutHref} data-test="about-link">{aboutLabel}</a>
                <a className="nav-link text-nowrap flex-shrink-0" href={blogHref} data-test="blog-link">Blog</a>
                <BlogNavSearch pathName={this.props.pathName} />
                <a
                  className="nav-link text-nowrap flex-shrink-0 ms-lg-2"
                  href={languageHref}
                  data-test="navbar-language-link"
                  lang={languageLabel === "English" ? "en" : "pl"}
                >
                  {languageLabel}
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
