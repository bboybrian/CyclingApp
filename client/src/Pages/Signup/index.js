import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import "./Signup.css"
import Footer from "Core/footer";
import backend from "axios_config";
import Dropdown from "Dropdown";
import Header from "Header";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("default");

  const dropdownTypes = [{
    value: "default",
    label: "I would like to sign up as a ..."
  },{
    value: "coach",
    label: "Coach"
  },{
    value: "athlete",
    label: "Athlete"
  },{
    value: "sportsscientist",
    label: "Sports Scientist"    
  }];

  const register = () => {
    (async() => {
        if (password !== confirmPassword) {
            alert("Error: Password and confirm password fields don't match.");
        } else if (type === "default") {
            alert("Error: Please select a type");
        } else {
            const requestDetails = {
                "email": email,
                "password": password,
                "type": type
            };

            try {
                const response = await backend.post("/register", requestDetails);
                if (response.status === 200) {
                    navigate("/");
                } 
            } catch(e) {
                alert(e.response.data);
            }
        }
    })();
  };

  return (
    <MainContainer>
        <Header>
            <USBLogo/>
            <div className="Top-Buttons">
                <Button type="secondary" label="Log In" onClick={() => navigate("/")}/>
                <Button type="primary" label="Sign Up"/>
            </div>
        </Header>
        <div className="SignupPage_Container">
            <div className="Container_Left">
                <img className = "SignupPage_UBSLogo" src="Logo_UltimateBikeSplit.png" alt=""></img>
                <p style={{textAlign:"center",fontSize:"18px", fontStyle:"normal",color:"white",lineHeight:1.5}}>
                    {/* <span class="bolded">TEAM CYCOUT 4</span><br></br><br></br> */}
                    Minhaj Ahmed<br></br>
                    Dimas Putra Anugerah<br></br>
                    Muhammad Alfatah Bin Jalalludin<br></br>
                    Jolene Loo<br></br>
                    Nathan Shepherd<br></br>
                    Sze Kai Brian Tan<br></br>
                    Yvonne Tansu<br></br>
                    Jash Vira<br></br>
                    Ren You
                </p>
            </div>
            <div className="LoginPage_Form">
                <h3 className="Login-Header">Sign Up</h3>
                <div className="Form-Contents">
                    <Input className="form-input" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <div className="SignupPage-PasswordFields">
                        <Input className="form-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        <Input className="form-input" type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    <Dropdown type="dropdown_primary" options={dropdownTypes} onChange={(e) => setType(e.target.value)}/>
                    <Button type="form-large" label="Sign up" onClick={() => register()}/>
                    <div className="DivOr" style={{textAlign:"center", color:"white", fontSize:"13px"}}>
                        or
                    </div>
                    <div className="Google-Box">
                        <div className="Google-Signup">
                            <img className="Img4" src="Logo_G.jpg" alt=""></img>&emsp;Sign up with Google
                        </div>
                    </div>
                    <p style={{textAlign:"center",fontSize:"13px", fontStyle:"normal",color:"white"}}>
                        Already have an account? <span className="Register" onClick={() => navigate("/")}><b>Log in here!</b></span>
                    </p>
                </div>
            </div>
        </div>
        <Footer/>
    </MainContainer>
  )
}

export default SignUp;