import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './Pages/Login';
import { accountDetails } from './context.js';
import { useEffect, useState } from 'react';
import Dashboard from 'Pages/Dashboard';
import EditProfile from 'Pages/EditProfile';
import MyAthletes from 'Pages/MyAthletes';
import AthleteBikes from 'Pages/AthleteBikes';
import MyBikes from 'Pages/MyBikes';
import MyRaces from 'Pages/MyRaces'
import SignUp from 'Pages/Signup';
import EditProfileCoach from 'Pages/EditProfileCoach';
import CoursePage from 'Pages/Courses';
import ViewCourse from 'Pages/Courses/View';
import Race from 'Pages/Race';
import NotFound from 'Pages/NotFound/NotFound'
import RaceAnalytics from 'Pages/RaceAnalytics';

function App() {
  const [selectedAthlete, setSelectedAthlete] = useState({
    "athleteId": "",
    "athleteName": ""
  })

  const [accountData, setAccountData] = useState(JSON.parse(localStorage.getItem("currentLogin")) ?? {
      isLoggedIn: false,
      profileID: "",
      email: "",
      accountType: ""
  });



  useEffect(() => {
    localStorage.setItem("currentLogin", JSON.stringify(accountData));
    console.log(accountData)
  }, [accountData]);

  return (
    <accountDetails.Provider value={accountData}>
        <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login onLogin={setAccountData}/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/editprofile" element={<EditProfile/>} />
                <Route path="/myathletes" element={<MyAthletes selectedAthlete={setSelectedAthlete}/>} />
                <Route path="/myraces" element={<MyRaces/>} />
                <Route path="/athletebikes" element={<AthleteBikes selectedAthleteInfo={selectedAthlete}/>} />
                <Route path="/mybikes" element={<MyBikes/>} />
                <Route path="/editprofilecoach" element={<EditProfileCoach/>} />
                <Route path="/course" element={<CoursePage/>} />
                <Route path="/course/view/:courseID" element={<ViewCourse/>} />
                <Route path="/race" element={<Race/>} />
                <Route path="/race/analytics" element={<RaceAnalytics/>} />
                <Route path="*" element={<NotFound/>} />
              </Routes>
            </BrowserRouter>
        </div>
    </accountDetails.Provider>
  );
}

export default App;
