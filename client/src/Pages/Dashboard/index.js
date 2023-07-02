import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { accountDetails } from "context"
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import "./Dashboard.css"
import Footer from "Core/footer";
import { Navbar } from "Navbar";
import Header from "Header";
import DropdownComponent from "DropDownDate";
import DashboardToolbar from "./dashboardToolbar.js";

const Dashboard = () => {

return (
    <MainContainer>
        <Header>
            <DashboardToolbar/>
        </Header>
        <div className="page_title">
                Dashboard
            </div>
        <div className="dashboard_Container">
            <div className="dashboard_Form">
                DASHBOARD COMING SOON!
            </div>
        </div>
        <Footer/>
    </MainContainer>
    )
  }
  
  export default Dashboard;