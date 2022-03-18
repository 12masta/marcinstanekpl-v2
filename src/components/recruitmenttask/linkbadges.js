import * as React from "react"

export class LinkBadges extends React.Component {
  render() {
    return (
      <div className="container">
        <h4 className="text-center">
          Link do wideo z zadaniem:
          <a
            href="https://www.youtube.com/watch?v=AZYZFuNFUTs"
            className="badge bg-warning text-center text-dark"
          >
            klik
          </a>
        </h4>
        <h4 className="text-center">
          Link do boilerplate:
          <a
            href="https://github.com/12masta/selenium-csharp-boilerplate"
            className="badge bg-warning text-center text-dark"
          >
            klik
          </a>
        </h4>
        <h4 className="text-center">
          Link do kodu z rozwiązaniem:
          <a
            href="https://github.com/12masta/selenium-csharp-couponfollow-homework"
            className="badge bg-warning text-cente text-dark"
          >
            klik
          </a>
        </h4>
      </div>
    )
  }
}
