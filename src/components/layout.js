import * as React from "react"
import { Nav } from "./nav"
import { CookieConsentCustom } from "./common/cookieconsentcustom"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <main role="main">
        <Nav pathName={location.pathname} />
        <div className="container">{children}</div>
      </main>

      <CookieConsentCustom pathName={location.pathname} />

      <div className="container">
        <footer>© marcinstanek.pl, {new Date().getFullYear()}</footer>
      </div>
    </div>
  )
}

export default Layout
