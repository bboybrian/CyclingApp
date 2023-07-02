import React from "react"
import "./Input.css"

const Input = ({onChange, className, type, placeholder, value}) => {
    return <input onChange={onChange} className={className} type={type} placeholder={placeholder} value={value}/>;
}

export default Input;