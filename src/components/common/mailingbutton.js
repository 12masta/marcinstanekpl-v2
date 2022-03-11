import React, { useState, useEffect } from "react";

export const MailingButton = (props) => {
  const initialState = props.text;

  const [buttonText, setButtonText] = useState(props.text); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
  // the effect
  useEffect(() => {
    if(buttonText !== initialState){
      setTimeout(() => setButtonText(initialState), [1000])
    }
  }, [buttonText])

  const changeText = (text) => setButtonText(text);

  return (
    <button className="btn btn-primary text-uppercase btn-lg" type="button" onClick={() => changeText("newText")}>{buttonText}</button>
  )
};
