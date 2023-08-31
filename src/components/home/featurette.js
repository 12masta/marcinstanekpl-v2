import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Featurette extends React.Component {
  render() {

    let image;
    let column1Orientation;
    let column2Orientation;

    if(this.props.image === "qa"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/qa.png"
        quality={95}
        alt="jumbotron image"
        placeholder="blurred"
        loading="eager"
      />
    }
    else if(this.props.image === "automation"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/automation.png"
        quality={95}
        alt="jumbotron image"
        placeholder="blurred"
        loading="eager"
      />
    }
    else if(this.props.image === "complete_solutions"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/complete_solutions.png"
        quality={95}
        alt="jumbotron image"
        placeholder="blurred"
        loading="eager"
      />
    }
    else if(this.props.image === "on_time"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/on_time.png"
        quality={95}
        alt="jumbotron image"
        placeholder="blurred"
        loading="eager"
      />
    }
    else if(this.props.image === "inform"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/inform.png"
        quality={95}
        alt="jumbotron image"
        placeholder="blurred"
        loading="eager"
      />
    }

    if(this.props.alignToLeft === true){
      column1Orientation = "col-md-7";
      column2Orientation = "col-md-5";
    }
    else if(this.props.alignToLeft === false){
      column1Orientation = "col-md-7 order-md-2";
      column2Orientation = "col-md-5 order-md-1";
    }

    return (
    <div className="container marketing" id={this.props.id}>
      <hr className="featurette-divider" />
      <div className="row featurette">
        <div className={column1Orientation}>
          <h2 className="featurette-heading">{this.props.header}
          </h2>
          <p className="lead">{this.props.leadText}</p>
        </div>
        <div className={column2Orientation}>
          {image}

        </div>
      </div>
    </div>
    )
  }
}
