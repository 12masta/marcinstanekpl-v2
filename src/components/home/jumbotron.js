import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Jumbotron extends React.Component {
  render() {
    return (
      <div className="container px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <StaticImage
              className="d-block mx-lg-auto img-fluid"
              formats={["auto", "webp", "avif"]}
              src="../../images/home/hero.png"
              quality={95}
              alt="jumbotron image"
              placeholder="blurred"
              loading="eager"
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">{this.props.header}</h1>
            <p className="lead">{this.props.description}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                href="#featurette-want-to-know"
                type="button"
                className="btn btn-primary btn-lg px-4 me-md-2"
              >
                {this.props.wantToKnowMoreButtonText}
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
        <hr />
      </div>
    )
  }
}
