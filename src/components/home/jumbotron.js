import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class Jumbotron extends React.Component {
  render() {
    return (
    /*  <div className="container">
        <div className="container-fluid py-5">
          <div className="container">
            <div className="row h-100">
              <div className="col-md-6 my-auto">
                <StaticImage
                  className="w-75 img-fluid"
                  formats={["auto", "webp", "avif"]}
                  src="../../images/home/hero.png"
                  quality={95}
                  alt="jumbotron image"
                />
              </div>
              <div className="col-md-6 my-auto">
                <h1>
                  Inicjuję i naprawiam procesy kontroli jakości oprogramowania
                </h1>
                <p>
                  <a href="#want-to-know" className="btn btn-primary my-2">
                    Chcę wiedzieć więcej
                  </a>
                  <a href="/blog/pl/" className="btn btn-secondary my-2">
                    Blog
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>*/
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6">
          <StaticImage
            className="d-block mx-lg-auto img-fluid"
            formats={["auto", "webp", "avif"]}
            src="../../images/home/hero.png"
            quality={95}
            alt="jumbotron image"
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold lh-1 mb-3">Inicjuję i naprawiam procesy kontroli jakości oprogramowania</h1>
          <p className="lead">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s
            most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system,
            extensive prebuilt components, and powerful JavaScript plugins.</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">Chcę wiedzieć więcej</button>
            <button href="/blog/pl/" type="button" className="btn btn-outline-secondary btn-lg px-4">Blog</button>
          </div>
        </div>


      </div>
    )
  }
}
