import * as React from "react"
import { MailingButton } from "../common/mailingbutton"

export class Hero extends React.Component {


  render() {
    return (
      <div className="px-1 py-1 my-1 text-center">
        <h1 className="display-5 fw-bold">Rozwiązanie zadania rekrutacyjnego na podstawie Selenium WebDriver</h1>
        <div className="col-lg-10 mx-auto">
          <div className="ratio ratio-16x9">
            <iframe className="embed-responsive-item" src="https://player.vimeo.com/video/386467595" allowFullScreen/>
          </div>
          <div className="px-1 py-1 my-1 d-grid gap-2 d-sm-flex justify-content-sm-center">

            <div className="row">
              <div className="col-md-6">
                <div className="form-group d-flex">
                  <input type="email" className="form-control" id="email" placeholder="twójemail@przykład.com"/>
                </div>
              </div>
              <div className="col-md-6">
                Dodam Cię do listy mailowej z której możesz się wypisać w każdym momencie (jeden klik) <a
                href="/privacy-policy/">Polityka prywatności</a>
              </div>
            </div>
          </div>
          <div className="d-grid gap-2">
            <MailingButton text="dupa"/>
          </div>
        </div>
      </div>
    )
  }
}
