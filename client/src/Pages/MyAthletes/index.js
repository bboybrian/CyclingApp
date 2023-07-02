import React, { useEffect, useContext, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { accountDetails } from "context"
import { USBLogo } from "Logo"
import axios from "axios";
import MainContainer from "Core/container";
import Button from "Button"
import Input from "Input"
import Modal from "Modal"
import "./MyAthletes.css"
import Footer from "Core/footer";
import Header from "Header";
import backend from "axios_config";
import DashboardToolbar from "Pages/Dashboard/dashboardToolbar";

const MyAthletes = ({ selectedAthlete }) => {
    const [athleteArray, setAthleteArray] = useState([]);
    const [style, setStyle] = useState([]);

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [height, setHeight] = useState("");
    const [mass, setMass] = useState("");
    const [w_prime, setWPrime] = useState("");
    const [dob, setDOB] = useState("");
    const [gender, setGender] = useState("");
    const [other_mass, setOtherMass] = useState("");
    const [w_recovery, setRecovery] = useState("");
    const [critical_power, setCriticalPower] = useState("");
    const [email_address, setEmailAddress] = useState("");

    const navigate = useNavigate();

    const refreshAthleteList = () => {
        backend.get("/coach/get-my-athletes").then(response => {
            const athlete = response.data.recordset;
            setAthleteArray(athlete);
        });
    };

    const addAthlete = () => {
        (async () => {
            const addAthleteDetails = {
                "first_name": first_name,
                "last_name": last_name,
                "mass": mass,
                "height": height,
                "w_prime": w_prime,
                "dob": dob,
                "gender": gender,
                "other_mass": other_mass,
                "w_recovery": w_recovery,
                "critical_power": critical_power,
                "athleteEmail": email_address
            };
            console.log(addAthleteDetails)
            try {
                const response = await backend.post("/coach/create-athlete", addAthleteDetails);
                if (response.status === 200) {
                    console.log(response.data);
                    refreshAthleteList();
                }
            } catch (e) {
                alert(e.response.data);
                console.log(e);
            }
            onOpen(false)
        })();
    }

    const deleteAthlete = (index) => {
        console.log(index)
        console.log(athleteArray)
        
        const request = {
            "athleteId": athleteArray[index].Athlete_id
        };
        console.log(request)

        backend.delete(`/coach/athlete`, {data:request}).then(() => {
            refreshAthleteList();
        });

    }

    const selectAthlete = (index) => {
        console.log(index);
        console.log(athleteArray[index].Athlete_id);
        selectedAthlete({
            "athleteId": athleteArray[index].Athlete_id,
            "athleteName": athleteArray[index].first_name + " " + athleteArray[index].last_name
        })
        navigate("/athletebikes");
    };

    useEffect(() => console.log(style), [style]);
    useEffect(() => console.log(athleteArray), [athleteArray]);

    useEffect(() => {
        refreshAthleteList();
        setFirstName("")
        setLastName("")
        setGender("")
        setHeight("")
        setDOB("")
        setEmailAddress("")
        setMass("")
        setOtherMass("")
        setRecovery("")
        setWPrime("")
        setCriticalPower("")
    }, []);
    
    useEffect(() => {
        let display = [];
        for (var i = 0; i < athleteArray.length; i++) {
            display.push({
                name: "Item-Info-Hide",
                sign: "+"
            });
        }
        setStyle(display);
    }, [athleteArray]);
    //console.log(boolArray)
    //console.log(isShown)
    const showAthleteInfo = (event,index) => {
        let temp_state = [...style];
        let temp_element = { ...temp_state[index] };
        if (temp_element.name=="Item-Info-Hide") {
            temp_element.name = "Item-Info-Show";
            temp_element.sign = "-";
        } else {
            temp_element.name= "Item-Info-Hide";
            temp_element.sign="+"
        }
        temp_state[index] = temp_element;
        setStyle( temp_state );
    };

    const [open, onOpen] = useState(false);

    const showAddModal = () => {
        onOpen(state=>!state)
        //console.log(user)
    }

    return (
        <MainContainer>
            <Header>
                <DashboardToolbar/>
            </Header>
            <div className="Page-Content">
                <div className="Page-Heading">
                    My Athletes
                </div>
                <div className="Page-Box">
                    <div className="Box-Header">
                        <div style={{float:"left"}}>Athletes</div>
                    </div>
                    <div className="Add-Item">
                        <Button style={{float:"left"}} type="add-button" label="+ Add An Athlete" onClick={event => showAddModal()}/>
                        <Modal open={open} onClose={onOpen}>
                            <div className="Popup-Modal">
                                <div className="Modal-Heading">New Athlete</div>
                                <div className="Modal-Subheading">Athlete Data</div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>First Name<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setFirstName(e.target.value)}/>
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Last Name<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setLastName(e.target.value)}/>
                                </div>
                                <div className="Modal-Col3">
                                    <div style={{paddingBottom:"5px"}}>Birth Date<br/></div>
                                    <Input className="form-input" type="email" placeholder="YYYY/MM/DD" onChange={(e) => setDOB(e.target.value)}/>
                                </div>
                                <div className="Modal-Col4">
                                    <div style={{paddingBottom:"5px"}}>Gender<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setGender(e.target.value)}/>
                                </div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>Height<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setHeight(e.target.value)}/>
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Weight<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setMass(e.target.value)}/>
                                </div>
                                <div className="Modal-Col3">
                                    <div style={{paddingBottom:"5px"}}>Other Mass<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setOtherMass(e.target.value)}/>
                                </div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>W_Prime<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setWPrime(e.target.value)}/>
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Recovery<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setRecovery(e.target.value)}/>
                                </div>
                                <div className="Modal-Col3">
                                    <div style={{paddingBottom:"5px"}}>Critical Power<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCriticalPower(e.target.value)}/>
                                </div>
                                <div className="Modal-Col-Email">
                                    <div style={{paddingBottom:"5px"}}>Email Address (Please enter the email if it is a valid account)<br/></div>
                                    <Input className="form-input" type="email" placeholder="xyz@gmail.com" onChange={(e) => setEmailAddress(e.target.value)}/>
                                </div>
                                <div className="Modal-Button-Col4">
                                    <Button style={{float:"left"}} type="add-button" label="Add Athlete" onClick={event => addAthlete()}/>
                                </div>
                            </div>
                        </Modal>
                    </div>         
                    <div className="Item-List">
                        {athleteArray.length >= 1 && (
                            Array.from({length: athleteArray.length}).map((_, index) => (
                                <div style={{paddingBottom: "15px"}}>
                                    <div className="Item-Container">
                                        <button className="Item-Plus" onClick={event => showAthleteInfo(event, index)}>
                                            {style[index]?.sign}
                                        </button>
                                        <div className="Item-Name">{athleteArray[index]?.first_name} {athleteArray[index]?.last_name}</div>
                                        <div className="Select-Item">
                                            <Button type="select-delete" label="Select Athlete" onClick={event => selectAthlete(index)}/>
                                        </div>
                                        <div className="Delete-Item">
                                            <Button type="select-delete" label="Delete Athlete" onClick={event => deleteAthlete(index)}/>
                                        </div>
                                    </div>
                                    <div className={style[index]?.name}>
                                        <div className="Col1">Birth Date</div>
                                        <div className="Col2">{athleteArray[index]?.dob}</div>
                                        <div className="Col3">Gender</div>
                                        <div className="Col4">{athleteArray[index]?.gender}</div>
                                        <div className="Col1">Height</div>
                                        <div className="Col2">{athleteArray[index]?.height}</div>
                                        <div className="Col3">Weight</div>
                                        <div className="Col4">{athleteArray[index]?.mass}</div>
                                        <div className="Col1">Other Mass</div>
                                        <div className="Col2">{athleteArray[index]?.other_mass}</div>
                                        <div className="Col3">W_Prime</div>
                                        <div className="Col4">{athleteArray[index]?.w_prime}</div>
                                        <div className="Col1">Recovery</div>
                                        <div className="Col2">{athleteArray[index]?.w_recovery}</div>
                                        <div className="Col3">Critical Power</div>
                                        <div className="Col4">{athleteArray[index]?.critical_power}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </MainContainer>
        )
  }
  
  export default MyAthletes;