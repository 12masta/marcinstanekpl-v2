import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Jumbotron extends React.Component {
  render() {
    return (
      <div className="container px-4 pt-2 pb-4 pb-lg-3">
        <div className="row flex-lg-row-reverse align-items-center g-5 pt-0 pb-4 pb-lg-0">
          <div className="col-10 col-sm-8 col-lg-6">
            <StaticImage
              className="d-block mx-lg-auto img-fluid"
              formats={["auto", "webp", "avif"]}
              src="../../images/home/hero.png"
              quality={90}
              alt="jumbotron image"
              placeholder="blurred"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">{this.props.header}</h1>
            <p className="lead">{this.props.description}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                href={
                  this.props.contactMailSubject
                    ? `mailto:kontakt@marcinstanek.pl?subject=${encodeURIComponent(
                        this.props.contactMailSubject
                      )}`
                    : "mailto:kontakt@marcinstanek.pl"
                }
                className="btn btn-primary btn-lg px-4 me-md-2"
              >
                {this.props.contactButtonText}
              </a>
              <a
                href={this.props.blogUrl}
                type="button"
                className="btn btn-outline-secondary btn-lg px-4"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
