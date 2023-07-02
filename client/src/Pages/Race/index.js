import React from "react"
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import "./Race.css"
import Footer from "Core/footer";
import Header from "Header";
import DropdownComponent from "DropDownDate";
import DashboardToolbar from "../Dashboard/dashboardToolbar";
import Map from "Map";
// import { graphingData } from "./black_box_fxn";

const Race = () => {

return (
    <MainContainer>
        <Header>
            <DashboardToolbar/>
        </Header>
        <div className="race_page_title">
            {/* put racecourse name here */}
                Race!
            </div>
        <div className="race_Container">
            <div className="race_form">
                <div className="race_section_titles">
                    Race Power/Position Plan
                </div>
                <hr></hr>
                <div className="inputs_power">
                    <div className="input_header">Power Input (% of CP)</div>
                    <div className="input_header">Steady State Slope Threshold</div>
                    <div className="input_header">Position Slope Threshold</div>
                    <div className="input_text">Steady State</div>
                    <Input className="input_form" placeholder="91%"/>
                    <div className="input_text">Min Slope</div>
                    <Input className="input_form" placeholder="-1%"/>
                    <div className="input_text">Climbing</div>
                    <Input className="input_form" placeholder="3%"/>
                    <div className="input_text">Over Threshold</div>
                    <Input className="input_form" placeholder="110%"/>
                    <div className="input_text">Max Slope</div>
                    <Input className="input_form" placeholder="7.5%"/>
                    <div className="input_text">Descending</div>
                    <Input className="input_form" placeholder="2%"/>                    
                    <div className="input_text">Descending</div>
                    <Input className="input_form" placeholder="-1%"/>
                </div>
            </div>

            {/* <div className="race_form">
                <div className="section_titles">
                    Athlete
                </div>
                <hr></hr>
            </div>

            <div className="race_form">
                <div className="section_titles">
                    Bike
                </div>
                <hr></hr>
            </div>

            <div className="race_form">
                <div className="section_titles">
                    Weather
                </div>
                <hr></hr>
            </div>

            <div className="race_form">
                <div className="section_titles">
                    Constants
                </div>
                <hr></hr>
            </div> */}
        </div>
        <Footer/>
    </MainContainer>
    )
  }
  
  export default Race;