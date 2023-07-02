import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { accountDetails } from "context"
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import "./EditProfileCoach.css"
import Footer from "Core/footer";
import { Navbar } from "Navbar";
import Header from "Header";
import DropdownComponent from "DropDownDate";
import DashboardToolbar from "../Dashboard/dashboardToolbar";

const EditProfileCoach = () => {

return (
    <MainContainer>
        <Header>
            <DashboardToolbar/>
        </Header>
        <div className="page_title">
                My Profile
            </div>
        <div className="editprofile_Container">
            
            
            <div className="editprofile_Form">
                <div className="section_titles">
                    Personal Details
                    <hr></hr>
                </div>
                <div className="edit_profile_row">
                    <div className="editprofile_text first_name">
                        First Name
                    </div>
                    <div className="Form-Contents first_name">
                        <Input className="form-input" type="email" placeholder="Peter"/>
                    </div>
                    <div className="editprofile_text last_name">
                        Last Name
                    </div>
                    <div className="Form-Contents last_name">
                        <Input className="form-input" type="email" placeholder="Smith"/>
                    </div>

                    <div className="editprofile_text">
                        Role
                    </div>
                    <div className="coach_role">
                        <Input className="form-input" type="email" placeholder="Coach"/>
                    </div>

                    </div>
                    <div className="edit_profile_row_email">
                    <div className="editprofile_text experience">
                        Email
                    </div>
                    <div className="edit_profile_coach_email">
                        <Input className="form-input" type="email" placeholder="john.smith@gmail.com"/>
                    </div>
                    
                    
               
                    </div>

            </div>
            
           


            <div className="editprofile_Form">
                <div className="section_titles">
                    Change Password
                    <hr></hr>
                </div>
                <div className="edit_profile_row">
                    <div className="editprofile_text first_name">
                        Current Password
                    </div>
                    <div className="Form-Contents first_name">
                        <Input className="form-input" type="password" placeholder="400"/>
                    </div>
                </div>
                <div className="edit_profile_row">
                    <div className="editprofile_text first_name">
                        New Password
                    </div>
                    <div className="Form-Contents first_name">
                        <Input className="form-input" type="email" placeholder="New Password"/>
                    </div>
                    <div className="editprofile_text last_name">
                       Confirm New Password
                    </div>
                    <div className="Form-Contents last_name">
                        <Input className="form-input" type="email" placeholder="Confirm New Password"/>
                    </div>
                    <div className="confirm_button_row">
                        <div className="savechanges_button">
                            Save Changes
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <Footer/>
    </MainContainer>
    )
  }
  
  export default EditProfileCoach;