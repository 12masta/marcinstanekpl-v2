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
      />
    }
    else if(this.props.image === "automation"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/automation.png"
        quality={95}
        alt="jumbotron image"
      />
    }
    else if(this.props.image === "complete_solutions"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/complete_solutions.png"
        quality={95}
        alt="jumbotron image"
      />
    }
    else if(this.props.image === "on_time"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/on_time.png"
        quality={95}
        alt="jumbotron image"
      />
    }
    else if(this.props.image === "inform"){
      image = <StaticImage
        className="d-block mx-lg-auto img-fluid"
        formats={["auto", "webp", "avif"]}
        src="../../images/home/inform.png"
        quality={95}
        alt="jumbotron image"
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
    <div className="container marketing">
      <hr className="featurette-divider" />
      <div className="row featurette">
        <div className={column1Orientation}>
          <h2 className="featurette-heading">{this.props.header}
          {/*<span className="text-muted">It’ll blow your mind.</span>*/}
          </h2>
          <p className="lead">{this.props.leadText}</p>
        </div>
        <div className={column2Orientation}>
     {/*     <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500"
               height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500"
               preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
            <rect width="100%" height="100%" fill="#eee"></rect>
            <text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text>
          </svg>*/}
          {image}

        </div>
      </div>
    </div>
    )
  }
}
