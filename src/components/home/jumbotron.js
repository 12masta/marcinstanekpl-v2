import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Jumbotron extends React.Component {
  render() {
    return (
      <div className="py-4 mb-5 home-landing-hero">
        <div className="row flex-lg-row-reverse align-items-center g-4 g-lg-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <StaticImage
              className="d-block mx-lg-auto img-fluid home-gatsby-fill rounded"
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
            <h1 className="fs-2 fw-bold mb-3">{this.props.header}</h1>
            <p className="mb-4">{this.props.description}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                href={
                  this.props.contactMailSubject
                    ? `mailto:kontakt@marcinstanek.pl?subject=${encodeURIComponent(
                        this.props.contactMailSubject
                      )}`
                    : "mailto:kontakt@marcinstanek.pl"
                }
                className="btn btn-primary me-md-2"
              >
                {this.props.contactButtonText}
              </a>
              <a
                href={this.props.blogUrl}
                type="button"
                className="btn btn-outline-secondary"
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
