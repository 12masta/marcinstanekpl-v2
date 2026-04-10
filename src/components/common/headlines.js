import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Headlines extends React.Component {
  render() {
    return (
      <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
          <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
            <div className="my-3 p-3">
              <h2 className="fs-2 fw-bold mb-3">{this.props.header}</h2>
              <p className="mb-0">{this.props.lead}</p>
            </div>
            <div className="bg-dark mx-auto" />
          </div>
          <div className="me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
            <StaticImage
              className="d-block mx-lg-auto img-fluid rounded"
              formats={["auto", "webp", "avif"]}
              src="../../images/leadmagnet/lead_magnet_cover_big.png"
              quality={95}
              alt="jumbotron image"
              placeholder="blurred"
              loading="eager"
            />
          </div>
        </div>
    )
  }
}
