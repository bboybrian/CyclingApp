import React from "react"
import "./navbar.css"

export const Navbar = () => {
    return (
    <div>
    <ul class="navigation">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Products</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
    <img className="navigation" alt="UBS"/>;
    </div>
    )
}
