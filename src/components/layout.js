import * as React from "react"
import { Nav } from "./nav"
import CookieConsent from "react-cookie-consent"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <main role="main">
        <Nav pathName={location.pathname} />
        <div className="container">{children}</div>
      </main>

      <CookieConsent
        location="bottom"
        buttonText="Akceptuj"
        declineButtonText="Decline"
        cookieName="gatsby-gdpr-google-analytics"
      >
        Ta witryna przechowuje dane, w tym m.in. pliki cookie, aby zapewnić
        dostęp do podstawowych funkcjonalności witryny, a także na potrzeby
        marketingu, personalizacji i analiz. W każdej chwili możesz zmienić
        swoje ustawienia lub zaakceptować ustawienia domyślne. Polityka Cookie
      </CookieConsent>

      <div className="container">
        <footer>© marcinstanek.pl, {new Date().getFullYear()}</footer>
      </div>
    </div>
  )
}

export default Layout
