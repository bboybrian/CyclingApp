import { useNavigate, useLocation } from "react-router-dom";
import { accountDetails } from "context"
import React, { useContext } from "react"
import { USBLogo } from "Logo"

const DashboardToolbar = () => {

    const user = useContext(accountDetails);
    const currentUrl = useLocation();
    const navigate = useNavigate();

    const renderedOptions = user.accountType === "coach" ? (
        <>
            <div className={`${currentUrl.pathname.startsWith("/myathletes") ? "selectedNavPage" : ""} navbarbox athlete`} onClick={() => navigate("/myathletes")}>My Athletes</div>
            <div className={`${currentUrl.pathname.startsWith("/course") ? "selectedNavPage" : ""} navbarbox analytics`} onClick={() => navigate("/course")}>My Courses</div>
            <div className={`${currentUrl.pathname.startsWith("/race/analytics") ? "selectedNavPage" : ""} navbarbox analytics`} onClick={() => navigate("/race/analytics")}>Race Analytics</div>
            <div className="navbarbox compare">Compare Races</div>
        </>
        ) : (
        <>
            <div className={`${currentUrl.pathname.startsWith("/mybikes") ? "selectedNavPage" : ""} navbarbox athlete`} onClick={() => navigate("/mybikes")}>My Bikes</div>
            <div className={`${currentUrl.pathname.startsWith("/course") ? "selectedNavPage" : ""} navbarbox analytics`} onClick={() => navigate("/course")}>My Courses</div>
            <div className={`${currentUrl.pathname.startsWith("/myraces") ? "selectedNavPage" : ""} navbarbox compare`} onClick={() => navigate("/myraces")}>My Races</div>
        </>
    );

    return (
        <>
            <USBLogo/>
            <div className="navbar">
                <div className="navbar_top_row">
                    <div className="display_user_name">
                        {user.email} ({user.accountType})
                    </div>
                    <div className="navbar_logout" onClick={() => navigate("/")}>
                        LOGOUT
                    </div>
                </div>
                <div className="navbar_bot_row">
                    <div className={`${currentUrl.pathname === "/dashboard" ? "selectedNavPage" : ""} navbarbox dashboard`} 
                        onClick={() => navigate("/dashboard")}>My Dashboard</div>
                    <div className={`${currentUrl.pathname.startsWith("/editprofile") || currentUrl.pathname.startsWith("/editprofilecoach") 
                        ? "selectedNavPage" : ""} navbarbox profile`} onClick={() => user.accountType === "athlete" 
                        ? navigate("/editprofile") : navigate("/editprofilecoach")}>My Profile</div>
                    {renderedOptions}
                </div>
            </div>
        </>
    );
}

export default DashboardToolbar;