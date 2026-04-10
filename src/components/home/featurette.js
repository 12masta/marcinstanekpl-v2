import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Featurette extends React.Component {
  render() {

    let image;
    let column1Orientation;
    let column2Orientation;

    if(this.props.image === "qa"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid w-100 home-featurette-image rounded"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/qa.png"
        quality={85}
        alt="jumbotron image"
        placeholder="blurred"
      />
    }
    else if(this.props.image === "automation"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid w-100 home-featurette-image rounded"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/automation.png"
        quality={85}
        alt="jumbotron image"
        placeholder="blurred"
      />
    }
    else if(this.props.image === "complete_solutions"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid w-100 home-featurette-image rounded"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/complete_solutions.png"
        quality={85}
        alt="jumbotron image"
        placeholder="blurred"
      />
    }
    else if(this.props.image === "on_time"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid w-100 home-featurette-image rounded"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/on_time.png"
        quality={85}
        alt="jumbotron image"
        placeholder="blurred"
      />
    }
    else if(this.props.image === "inform"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid w-100 home-featurette-image rounded"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/inform.png"
        quality={85}
        alt="jumbotron image"
        placeholder="blurred"
      />
    }

    // Below md: image on top (order-1 / order-2). md+: preserve text-left vs image-left layout.
    if(this.props.alignToLeft === true){
      column1Orientation = "col-md-7 order-2 order-md-1";
      column2Orientation = "col-md-5 order-1 order-md-2";
    }
    else if(this.props.alignToLeft === false){
      column1Orientation = "col-md-7 order-2 order-md-2";
      column2Orientation = "col-md-5 order-1 order-md-1";
    }

    return (
    <div className="marketing mb-5 home-landing-section" id={this.props.id}>
      <div className="row featurette align-items-md-center">
        <div className={column1Orientation}>
          <h2 className="fs-4 fw-bold mb-3">{this.props.header}</h2>
          {this.props.leadTextDesktop ? (
            <>
              <p
                className="mb-3 d-md-none"
                data-testid={`${this.props.id}-lead-mobile`}
              >
                {this.props.leadText}
              </p>
              <p
                className="mb-3 d-none d-md-block"
                data-testid={`${this.props.id}-lead-desktop`}
              >
                {this.props.leadTextDesktop}
              </p>
            </>
          ) : (
            <p className="mb-3">{this.props.leadText}</p>
          )}
        </div>
        <div className={column2Orientation}>
          {image}

        </div>
      </div>
    </div>
    )
  }
}
