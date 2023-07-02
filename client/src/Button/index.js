import React from "react"
import "./Button.css"

function Button({onClick, type, label}) {   
    return (
      <button onClick={onClick} className={type}>
        {label}
      </button>
    );
   }

export default Button;