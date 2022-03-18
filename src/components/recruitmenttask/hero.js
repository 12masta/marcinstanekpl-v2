import * as React from "react"

export class Hero extends React.Component {
  render() {
    return (
      <div className="px-1 py-1 my-1 text-center">
        <h1 className="display-5 fw-bold">
          Rozwiązanie zadania rekrutacyjnego na podstawie Selenium WebDriver
        </h1>
        <div className="col-lg-10 mx-auto">
          <div className="ratio ratio-16x9">
            <iframe
              title="hero-iframe"
              className="embed-responsive-item"
              src={this.props.videoLink}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    )
  }
}
