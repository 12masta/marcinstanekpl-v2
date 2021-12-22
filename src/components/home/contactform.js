import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export class ContactForm extends React.Component {
  render() {


    return (
      <div className="container">
        <hr/>
        <h2 className="text-center">{this.props.header}</h2>
        <form id="messageForm">

          <div className="input-group mb-3">

            <label htmlFor="emailInput" className="bmd-label-floating visually-hidden-focusable">Email</label>

            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">@</span>
            </div>
            <input id="emailInput" type="text" className="form-control" placeholder="example@gmail.com"
                   aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="form-group text-center">
            <label htmlFor="messageTextArea">{this.props.labelMessage}</label>
            <textarea className="form-control" id="messageTextArea" rows="6"></textarea>
          </div>

          <div className="text-center">
            <div className="checkbox">
              <label>
                <input id="messageCheckbox" type="checkbox"/> {this.props.messageCheckboxText} <a href={this.props.privacyPolicyLink}
              >{this.props.privacyPolicyText}</a>
              </label>
            </div>

            <button id="SendButton" type="submit" className="btn btn-primary">{this.props.buttonText}
            </button>
          </div>
        </form>
        <hr/>
      </div>
    )
  }
}
