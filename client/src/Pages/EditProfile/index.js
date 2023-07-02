import React from "react"
import MainContainer from "Core/container";
import Input from "Input"
import "./EditProfile.css"
import Footer from "Core/footer";
import Header from "Header";
import DashboardToolbar from "../Dashboard/dashboardToolbar";

const EditProfile = () => {

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
                    <div className="editprofile_text dob">
                        Date of Birth
                    </div>
                    <div className="dob_grid">
                    <div className="edit_profile_month">
                        <select className="form-input">
                            <option value="" disabled selected>September</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                    <div className="edit_profile_day">
                    <select className="form-input">
                        <option value="" disabled selected>30</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                    <div className="edit_profile_year">
                    <select className="form-input">
                    <option value="" disabled selected>2000</option>
                            <option value="2000">2000</option>
                        </select>
                    </div>
                    </div>
                    </div>
                    <div className="edit_profile_row">
                    <div className="editprofile_text experience">
                        Experience
                    </div>
                    <div className="edit_profile_experience">
                        <select className="form-input">
                            <option value="" disabled selected>Pro/Elite</option>
                            <option value="Pro/Elite">Pro/Elite</option>
                        </select>
                    </div>
                    <div className="editprofile_text trainingelevation">
                        Training Elevation
                    </div>
                    <div className="Form-Contents trainingelevation">
                        <div className="trainingelevationgrid">
                            <Input className="form-input trainingelevation" type="email" placeholder="0.00"/>
                            <div className="editprofile_text m">m</div>
                        </div>
                    </div>
                    <div className="genderrolecontainer">
                        <div className="editprofile_text gender">
                            Gender
                        </div>
                        <div className="editprofile_text role">
                            Role
                        </div>
                    </div>
                    <div className="genderrolecontainer">
                    <div className="edit_profile_gender">
                        <select className="form-input">
                            <option value="" disabled selected>Male</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="Form-Contents role" >
                        <Input className="form-input" type="email" placeholder="Athlete" readonly/>
                    </div>
                    </div>
                    </div>

                    <div className="edit_profile_row">
                        <div className="editprofile_text height">
                            Height
                        </div>
                        <div className="Form-Contents height">
                            <div className="trainingelevationgrid">
                                <Input className="form-input trainingelevation" type="email" placeholder="185.00"/>
                                <div className="editprofile_text m">cm</div>
                            </div>
                        </div>
                        <div className="editprofile_text weight">
                            Weight
                        </div>
                        <div className="Form-Contents weight">
                            <div className="trainingelevationgrid">
                                <Input className="form-input trainingelevation" type="email" placeholder="69.00"/>
                                <div className="editprofile_text m">kg</div>
                            </div>
                        </div>
                    </div>
            </div>
            
            <div className="editprofile_Form">
                <div className="section_titles">
                    Calculated Values
                    <hr></hr>
                </div>
                <div className="edit_profile_row">
                    <div className="editprofile_text first_name">
                        FTP
                    </div>
                    <div className="Form-Contents first_name">
                        <Input className="form-input" type="email" placeholder="400"/>
                    </div>
                    <div className="editprofile_text last_name">
                       Max HR
                    </div>
                    <div className="Form-Contents last_name">
                        <Input className="form-input" type="email" placeholder="200"/>
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
  
  export default EditProfile;