import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import "./Login.css"
import Footer from "Core/footer";
import Header from "Header";
import backend from "axios_config.js";

const Login = ({ onLogin }) => {
    const loginEnter = (e) => {
        if (e.key === "Enter") {
            console.log("Login/index.js  |  Press enter to login");
            updateAccountDetails();
        }
    };
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const updateAccountDetails = () => {
        (async () => {
            const requestDetails = {
                "email": email,
                "password": password
            };

            try {
                const response = await backend.post("/login", requestDetails);
                if (response.status === 200) {
                    console.log(response.data);
                    onLogin({
                        isLoggedIn: true,
                        profileID: response.data.recordset[0].ID,
                        email: email,
                        accountType: response.data.recordset[0].type
                    });
                    navigate("/dashboard");
                }
            } catch (e) {
                alert(e.response.data);
                console.log(e);
            }
        })();
    }

    return (
        <MainContainer>
            <Header>
                <USBLogo />
                <div className="Top-Buttons">
                    <Button type="secondary" label="Log In" />
                    <Button type="primary" label="Sign Up" onClick={() => navigate("/signup")} />
                </div>
            </Header>
            <div className="LoginPage_Container">
                <img className="Container_Left" src="cycling.png" alt=""></img>
                <div className="LoginPage_Form">
                    <h3 className="Login-Header">Log In</h3>
                    <div className="Form-Contents" onKeyPress={(e) => loginEnter(e)}>
                        <Input className="form-input" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <Input className="form-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <div style={{ justifySelf: "left" }} className="Forgot-Link">Forgot Password?</div>
                        <Button type="form-large" label="Log In" onClick={() => updateAccountDetails()} />
                        <div className="DivOr" style={{ textAlign: "center", color: "white", fontSize: "13px" }}>or</div>
                        <div className="Google-Box">
                            <div className="Google-Signup">
                                <img className="Img4" src="Logo_G.jpg" alt=""></img>&emsp;Sign in with Google
                            </div>
                        </div>
                        <p style={{ textAlign: "center", fontSize: "13px", fontStyle: "normal", color: "white" }}>New to Ultimate Bike Split? <span className="Register" onClick={() => navigate("/signup")}><b>Sign up here!</b></span></p>
                    </div>
                </div>
            </div>
            <Footer />
        </MainContainer>
    )
}

export default Login;