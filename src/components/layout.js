import * as React from "react"
import { Nav } from "./nav"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <main role="main">
        <Nav />
        <div className="container">{children}</div>
      </main>

      <div className="container">
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
      </div>
    </div>
  )
}

export default Layout
