import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { accountDetails } from "context"
import axios from "axios";
import { USBLogo } from "Logo"
import MainContainer from "Core/container";
import Button from "Button"
import Modal from "Modal"
import Dropdown from "Dropdown"
import Header from "Header";
import Input from "Input"
import "./AthleteBikes.css"
import Footer from "Core/footer";
import { Navbar } from "Navbar";
import backend from "axios_config";
import DashboardToolbar from "Pages/Dashboard/dashboardToolbar";

const AthleteBikes = ({ selectedAthleteInfo }) => {
    console.log(selectedAthleteInfo)

    const [bikeArray, setBikeArray] = useState([]);
    const [style, setStyle] = useState([]);

    const [bikeId, setBikeId] = useState("");
    const [name, setName] = useState("");
    const [mass, setMass] = useState("");
    const [crr, setCrr] = useState("");
    const [mech_eff, setMechEff] = useState("");
    const [moi_whl_front, setMoiWhlFront] = useState("");
    const [moi_whl_rear, setMoiWhlRear] = useState("");
    const [wheel_radius, setWheelRadius] = useState("");
    const [cda_12, setCDA12] = useState("");
    const [cda_14, setCDA14] = useState("");
    const [cda_16, setCDA16] = useState("");
    const [cda_climb, setCDAClimb] = useState("");
    const [cda_descend, setCDADescend] = useState("");

    const refreshBikeList = () => {
        backend.get("/athletes/get-bikes?athleteId="+selectedAthleteInfo.athleteId).then(response => {
            const bike = response.data.recordset;
            setBikeArray(bike);
        });
    };

    const addBike = () => {
        (async () => {
            const addBikeDetails = {
                "athleteId": selectedAthleteInfo.athleteId,
                "name": name,
                "mass": mass,
                "crr": crr,
                "mech_eff": mech_eff,
                "moi_whl_front": moi_whl_front,
                "moi_whl_rear": moi_whl_rear,
                "wheel_radius": wheel_radius,
                "cda_12": cda_12,
                "cda_14": cda_14,
                "cda_16": cda_16,
                "cda_climb": cda_climb,
                "cda_descend": cda_descend
            };
            try {
                const response = await backend.post("/athletes/insert-bike", addBikeDetails);
                if (response.status === 200) {
                    console.log(response.data);
                    refreshBikeList();
                }
            } catch (e) {
                alert(e.response.data);
                console.log(e);
            }
            onOpen1(false)
        })();
    }

    const editBike = () => {
        (async () => {
            const editBikeDetails = {
                "bikeId": bikeId,
                "name": name,
                "mass": mass,
                "crr": crr,
                "mech_eff": mech_eff,
                "moi_whl_front": moi_whl_front,
                "moi_whl_rear": moi_whl_rear,
                "wheel_radius": wheel_radius,
                "cda_12": cda_12,
                "cda_14": cda_14,
                "cda_16": cda_16,
                "cda_climb": cda_climb,
                "cda_descend": cda_descend
            };
            console.log(editBikeDetails)
            try {
                const response = await backend.post("/athletes/edit-bike", editBikeDetails);
                if (response.status === 200) {
                    console.log(response.data);
                    refreshBikeList();
                }
            } catch (e) {
                alert(e.response.data);
                console.log(e);
            }
            onOpen2(false)
        })();
    }

    useEffect(() => console.log(style), [style]);
    useEffect(() => console.log(bikeArray), [bikeArray]);

    useEffect(() => {
        refreshBikeList();
    }, []);

    useEffect(() => {
        let display = [];
        for (var i = 0; i < bikeArray.length; i++) {
            display.push({
                name: "Item-Info-Hide",
                sign: "+"
            });
        }
        setStyle(display);
    }, [bikeArray]);

    const [open1, onOpen1] = useState(false);

    const [open2, onOpen2] = useState(false);

    const showAddModal = () => {
        setName("")
        setMass("")
        setCrr("")
        setMechEff("")
        setMoiWhlFront("")
        setMoiWhlRear("")
        setWheelRadius("")
        setCDA12("")
        setCDA14("")
        setCDA16("")
        setCDAClimb("")
        setCDADescend("")
        onOpen1(state=>!state)
    }

    const [editIndex, setEditIndex] = useState(0)

    const showEditModal = (index) => {
        console.log(index)
        setEditIndex(index)
        setBikeId(bikeArray[index].ID)
        setName(bikeArray[index].name)
        setMass(bikeArray[index].mass)
        setCrr(bikeArray[index].crr)
        setMechEff(bikeArray[index].mech_eff)
        setMoiWhlFront(bikeArray[index].moi_whl_front)
        setMoiWhlRear(bikeArray[index].moi_whl_rear)
        setWheelRadius(bikeArray[index].wheel_radius)
        setCDA12(bikeArray[index].cda_12)
        setCDA14(bikeArray[index].cda_14)
        setCDA16(bikeArray[index].cda_16)
        setCDAClimb(bikeArray[index].cda_climb)
        setCDADescend(bikeArray[index].cda_descend)
        onOpen2(state=>!state)
    }

    const deleteBike = (index) => {
        console.log(index)
        console.log(bikeArray)
        console.log(bikeArray[index].ID)
        const request = {
            "bikeId": bikeArray[index].ID
        };
        console.log(request)

        backend.delete(`/athletes/bike`, {data:request}).then(() => {
            refreshBikeList();
        });

    }


    //console.log(isShown)
    const showBikeInfo = (index) => {
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

    return (
        <MainContainer>
            <Header>
                <DashboardToolbar/>
            </Header>
            <div className="Page-Content">
                <div className="Page-Toolbar">
                    <div className="Toolbar-Heading">Current Athlete:</div>
                    <div className="Item-Name-Box">{selectedAthleteInfo.athleteName}</div>
                    <Button type="toolbar-button" label="Dashboard"/>
                    <Button type="toolbar-button" label="Profile"/>
                    <Button type="toolbar-button" label="Bikes"/>
                    <Button type="toolbar-button" label="Races"/>
                    <Button type="toolbar-button" label="Courses"/>
                </div>
                <div className="Page-Box">
                    <div className="Box-Header">
                        <div style={{float:"left"}}>Athlete Bikes</div>
                    </div>
                    <div className="Add-Item">
                        <Button style={{float:"left"}} type="add-button" label="+ Add A Bike" onClick={event => showAddModal()}/>
                        <Modal open={open1} onClose={onOpen1}>
                            <div className="Popup-Modal">
                                <div className="Modal-Heading">Athlete Bike [ New ]</div>
                                <div className="Modal-Subheading">Bike Data</div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>Bike Name<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setName(e.target.value)}/>
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Bike Weight<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setMass(e.target.value)} />
                                </div>
                                <div className="Modal-Subheading">Wheel and Tyre Data</div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>Wheel Radius<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setWheelRadius(e.target.value)} />
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Moi Wheel Front<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setMoiWhlFront(e.target.value)} />
                                </div>
                                <div className="Modal-Col3">
                                    <div style={{paddingBottom:"5px"}}>Moi Wheel Rear<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setMoiWhlRear(e.target.value)} />
                                </div>
                                <div className="Modal-Subheading">Calculated Values</div>
                                <div className="Modal-Col1">
                                    <div style={{paddingBottom:"5px"}}>Rolling Resistance<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCrr(e.target.value)}/>
                                </div>
                                <div className="Modal-Col2">
                                    <div style={{paddingBottom:"5px"}}>Mechanical Efficiency<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setMechEff(e.target.value)}/>
                                </div>
                                <div className="Modal-Col3">
                                    <div style={{paddingBottom:"5px"}}>Climbing CdA<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCDAClimb(e.target.value)} />
                                </div>
                                <div className="Modal-Col4">
                                    <div style={{paddingBottom:"5px"}}>Descending CdA<br/></div>
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCDADescend(e.target.value)} />
                                </div>
                                <div className="Modal-CDA-Heading-1">Wind Speed</div>
                                <div className="Modal-CDA-Heading-2">CdA Value</div>
                                <div className="Modal-CDA-Col1">
                                    <div>12<br/></div>
                                </div>
                                <div className="Modal-CDA-Col2">
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCDA12(e.target.value)}/>
                                </div>
                                <div className="Modal-CDA-Col1">
                                    <div>14</div>
                                </div>
                                <div className="Modal-CDA-Col2">
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCDA14(e.target.value)}/>
                                </div>
                                <div className="Modal-CDA-Col1">
                                    <div>16<br/></div>
                                </div>
                                <div className="Modal-CDA-Col2">
                                    <Input className="form-input" type="email" placeholder="Peter" onChange={(e) => setCDA16(e.target.value)}/>
                                </div>
                                <div className="Modal-Button-Col4">
                                    <Button style={{float:"left"}} type="add-button" label="Add Bike" onClick={event => addBike()}/>
                                </div>
                            </div>
                        </Modal>
                    </div>         
                    <div className="Item-List">
                        {bikeArray.length >= 1 && (
                            Array.from({length: bikeArray.length}).map((_, index) => (
                                <div style={{paddingBottom: "15px"}}>
                                    <div className="Item-Container">
                                        <button className="Item-Plus" onClick={event => showBikeInfo(index)}>
                                            {style[index]?.sign}
                                        </button>
                                        <div className="Item-Name">{bikeArray[index]?.name}</div>
                                        <div className="Select-Item">
                                            <Button type="select-delete" label="Update Bike" onClick={event => showEditModal(index)}/>
                                        </div>
                                        <div className="Delete-Item">
                                            <Button type="select-delete" label="Delete Bike" onClick={event => deleteBike(index)}/>
                                        </div>
                                    </div>
                                    <div className={style[index]?.name}>
                                        <div className="Section-Heading">Bike Data</div>
                                        <div className="Col1">Bike Name</div>
                                        <div className="Col2">{bikeArray[index]?.name}</div>
                                        <div className="Col3">Weight</div>
                                        <div className="Col4">{bikeArray[index]?.mass}</div>
                                        <div className="Section-Heading">Wheel And Tyre Data</div>
                                        <div className="Col1">Wheel Radius</div>
                                        <div className="Col2">{bikeArray[index]?.wheel_radius}</div>
                                        <div className="Col3">Moi Wheel Front</div>
                                        <div className="Col4">{bikeArray[index]?.moi_whl_front}</div>
                                        <div className="Col1">Moi Wheel Rear</div>
                                        <div className="Col2">{bikeArray[index]?.moi_whl_rear}</div>
                                        <div className="Col3"></div>
                                        <div className="Col4"></div>
                                        <div className="Section-Heading">Calculated Values</div>
                                        <div className="Col1">Rolling Resistance</div>
                                        <div className="Col2">{bikeArray[index]?.crr}</div>
                                        <div className="Col3">Mechanical Efficiency</div>
                                        <div className="Col4">{bikeArray[index]?.mech_eff}</div>
                                        <div className="Col1">Climbing CdA</div>
                                        <div className="Col2">{bikeArray[index]?.cda_climb}</div>
                                        <div className="Col3">Descending CdA</div>
                                        <div className="Col4" style={{paddingBottom:"30px"}}>{bikeArray[index]?.cda_descend}</div>
                                        <div className="CDA-Heading-1">Wind Speed</div>
                                        <div className="CDA-Heading-2">CdA Value</div>
                                        <div className="Col1">12</div>
                                        <div className="Col2">{bikeArray[index]?.cda_12}</div>
                                        <div className="Col1">14</div>
                                        <div className="Col2">{bikeArray[index]?.cda_14}</div>
                                        <div className="Col1">16</div>
                                        <div className="Col2">{bikeArray[index]?.cda_16}</div>
                                    </div>
                                    <Modal open={open2} onClose={onOpen2}>
                                        <div className="Popup-Modal">
                                            <div className="Modal-Heading">{bikeArray[editIndex].name}</div>
                                            <div className="Modal-Subheading">Bike Data</div>
                                            <div className="Modal-Col1">
                                                <div style={{paddingBottom:"5px"}}>Bike Name<br/></div>
                                                <Input className="form-input" type="email" value={name} onChange={(e) => setName(e.target.value)}/>
                                            </div>
                                            <div className="Modal-Col2">
                                                <div style={{paddingBottom:"5px"}}>Bike Weight<br/></div>
                                                <Input className="form-input" type="email" value={mass} onChange={(e) => setMass(e.target.value)}/>
                                            </div>
                                            <div className="Modal-Subheading">Wheel and Tyre Data</div>
                                            <div className="Modal-Col1">
                                                <div style={{paddingBottom:"5px"}}>Wheel Radius<br/></div>
                                                <Input className="form-input" type="email" value={wheel_radius} onChange={(e) => setWheelRadius(e.target.value)} />
                                            </div>
                                            <div className="Modal-Col2">
                                                <div style={{paddingBottom:"5px"}}>Moi Wheel Front<br/></div>
                                                <Input className="form-input" type="email" value={moi_whl_front} onChange={(e) => setMoiWhlFront(e.target.value)} />
                                            </div>
                                            <div className="Modal-Col3">
                                                <div style={{paddingBottom:"5px"}}>Moi Wheel Rear<br/></div>
                                                <Input className="form-input" type="email" value={moi_whl_rear} onChange={(e) => setMoiWhlRear(e.target.value)} />
                                            </div>
                                            <div className="Modal-Subheading">Calculated Values</div>
                                            <div className="Modal-Col1">
                                                <div style={{paddingBottom:"5px"}}>Rolling Resistance<br/></div>
                                                <Input className="form-input" type="email" value={crr} onChange={(e) => setCrr(e.target.value)}/>
                                            </div>
                                            <div className="Modal-Col2">
                                                <div style={{paddingBottom:"5px"}}>Mechanical Efficiency<br/></div>
                                                <Input className="form-input" type="email" value={mech_eff} onChange={(e) => setMechEff(e.target.value)}/>
                                            </div>
                                            <div className="Modal-Col3">
                                                <div style={{paddingBottom:"5px"}}>Climbing CdA<br/></div>
                                                <Input className="form-input" type="email" value={cda_climb} onChange={(e) => setCDAClimb(e.target.value)} />
                                            </div>
                                            <div className="Modal-Col4">
                                                <div style={{paddingBottom:"5px"}}>Descending CdA<br/></div>
                                                <Input className="form-input" type="email" value={cda_descend} onChange={(e) => setCDADescend(e.target.value)} />
                                            </div>
                                            <div className="Modal-CDA-Heading-1">Wind Speed</div>
                                            <div className="Modal-CDA-Heading-2">CdA Value</div>
                                            <div className="Modal-CDA-Col1">
                                                <div>12<br/></div>
                                            </div>
                                            <div className="Modal-CDA-Col2">
                                                <Input className="form-input" type="email" value={cda_12} onChange={(e) => setCDA12(e.target.value)}/>
                                            </div>
                                            <div className="Modal-CDA-Col1">
                                                <div>14</div>
                                            </div>
                                            <div className="Modal-CDA-Col2">
                                                <Input className="form-input" type="email" value={cda_14} onChange={(e) => setCDA14(e.target.value)}/>
                                            </div>
                                            <div className="Modal-CDA-Col1">
                                                <div>16<br/></div>
                                            </div>
                                            <div className="Modal-CDA-Col2">
                                                <Input className="form-input" type="email" value={cda_16} onChange={(e) => setCDA16(e.target.value)}/>
                                            </div>
                                            <div className="Modal-Button-Col4">
                                                <Button style={{float:"left"}} type="add-button" label="Update Bike" onClick={event => editBike()}/>
                                            </div>
                                        </div>
                                    </Modal>
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
  
  export default AthleteBikes;