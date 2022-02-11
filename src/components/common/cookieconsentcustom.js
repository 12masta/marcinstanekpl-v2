import * as React from "react"
import CookieConsent from "react-cookie-consent"

export class CookieConsentCustom extends React.Component {
  render() {
    let buttonText
    let description
    let cookiePolicyLabel
    let cookiePolicyHref

    if (this.props.pathName.includes("/en")) {
      buttonText = "Accept"
      description =
        "This website stores data including, but not limited to, cookies to provide you with basic website functionalities as well as for marketing, personalization and analytics. You can change your settings or accept the default settings at any time."
      cookiePolicyLabel = "Learn more."
      cookiePolicyHref = "/en/privacy-policy"
    } else {
      buttonText = "Akceptuj"
      description =
        "Ta witryna przechowuje dane, w tym m.in. pliki cookie, aby zapewnić\n" +
        "        dostęp do podstawowych funkcjonalności witryny, a także na potrzeby\n" +
        "        marketingu, personalizacji i analiz. W każdej chwili możesz zmienić\n" +
        "        swoje ustawienia lub zaakceptować ustawienia domyślne. "
      cookiePolicyLabel = "Polityka cookies."
      cookiePolicyHref = "/privacy-policy"
    }

    return (
      <CookieConsent
        location="bottom"
        className="text-center"
        buttonText={buttonText}
        declineButtonText="Decline"
        cookieName="gatsby-gdpr-google-analytics"
        disableStyles={true}
        buttonClasses="btn btn-primary"
        contentClasses="col-12 col-md-10"
        buttonWrapperClasses="col-12 col-md-2"
        containerClasses="position-fixed p-2 bg-white border-5 row text-center"
      >
        {description} <a href={cookiePolicyHref}>{cookiePolicyLabel}</a>
      </CookieConsent>
    )
  }
}
