import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class ThankYou extends React.Component {
  render() {
    return (
      <div className="container">
        <hr/>
        <h2 className="text-center">Podziękowania</h2>
        <div className="row">
          <div className="col-md-4 p-3">
            <a href="https://couponfollow.com/about">
              <StaticImage
                className="d-block mx-lg-auto img-fluid"
                formats={["auto", "webp", "avif"]}
                src="../../images/seleniumrecruitmenttask/couponfollow_logo_color_wide.svg"
                quality={95}
                alt="jumbotron image"
                placeholder="blurred"
                loading="eager"
              />
            </a>

          </div>
          <div className="col-md-4 p-3">
            <a href="https://couponfollow.com/checkout">
              <StaticImage
                className="d-block mx-lg-auto img-fluid"
                formats={["auto", "webp", "avif"]}
                src="../../images/seleniumrecruitmenttask/cently_logo_green.svg"
                quality={95}
                alt="jumbotron image"
                placeholder="blurred"
                loading="eager"
              />
            </a>
          </div>
          <div className="col-md-4 p-3">
            <a href="https://itcraftship.com">
              <StaticImage
                className="d-block mx-lg-auto img-fluid"
                formats={["auto", "webp", "avif"]}
                src="../../images/seleniumrecruitmenttask/itcraftshipLogo_dark.png"
                quality={95}
                alt="jumbotron image"
                placeholder="blurred"
                loading="eager"
              />
            </a>
          </div>
        </div>
      </div>
    )
  }
}
