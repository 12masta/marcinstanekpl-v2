import React, { useState } from "react"

export const MailingSection = props => {
  const [buttonText, setButtonText] = useState(props.text)
  const [endpoint] = useState(props.endpoint)
  const [redirectionUrl] = useState(props.redirectionUrl)
  const [input, setInput] = useState("")
  const [inputClassName, setInputClassName] = useState("form-control")

  const subscribeUser = async () => {
    if (validateEmail(input)) {
      setButtonText("Trwa wysyłanie dokumentu...")
      await createOrUpdateContact(input)
    } else {
      setButtonText("Spróbuj ponownie, email jest niepoprawny")
      setInputClassName("form-control is-invalid")
    }
  }

  const createOrUpdateContact = async input => {
    const apiUrl = "https://pacific-lowlands-81394.herokuapp.com" + endpoint

    const contact = {
      contact: {
        email: input,
        firstName: "",
        lastName: "",
        phone: "",
      },
    }

    let response
    let json
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(contact),
      })

      json = await response.json()
    } catch (e) {
      setButtonText("Spróbuj ponownie")
    }

    if (json.statusCode === 200) {
      window.location.href = redirectionUrl.toString()
    } else {
      setButtonText("Spróbuj ponownie")
    }
  }

  const validateEmail = email => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  return (
    <div>
      <div className="px-1 py-1 my-1 text-center">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group d-flex">
              <input
                type="email"
                className={inputClassName}
                id="email"
                placeholder="twójemail@przykład.com"
                value={input}
                onInput={e => setInput(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            Dodam Cię do listy mailowej z której możesz się wypisać w każdym
            momencie (jeden klik){" "}
            <a href="/privacy-policy/">Polityka prywatności</a>
          </div>
        </div>
      </div>
      <div className="d-grid gap-2">
        <button
          className="btn btn-primary text-uppercase btn-lg"
          type="button"
          onClick={() => subscribeUser()}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
