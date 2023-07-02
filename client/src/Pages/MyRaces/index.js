import React, { useState } from "react"
import MainContainer from "Core/container";
import Button from "Button"
import "./MyRaces.css"
import Footer from "Core/footer";
import Header from "Header";
import DashboardToolbar from "Pages/Dashboard/dashboardToolbar";

const MyRaces = () => {

const raceArray = [
    {
        raceName: "TOKYO RACE",
        course: "Tokyo",
        time: "02:09:02",
        avgpower: "82.87 watts",
        variability_index: "1.08",
        stress_score: "174",
        avg_yaw_angle: "15.53",
        distance: "27.47 mi",
        avgspeed: "12.77 mph",
        normalized_power: "89.73 watts",
        intensity_factor: "0.90",
        watts_kg: "18.25",
        bike: "Ineos Pirenello",
    },
    {
        raceName: "ADELAIDE TOUR DOWN UNDER",
        course: "Adelaide",
        time: "02:09:02",
        avgpower: "82.87 watts",
        variability_index: "1.08",
        stress_score: "174",
        avg_yaw_angle: "15.53",
        distance: "27.47 mi",
        avgspeed: "12.77 mph",
        normalized_power: "89.73 watts",
        intensity_factor: "0.90",
        watts_kg: "18.25",
        bike: "Ineos Pirenello",
    },
];
const disp = []
for (var i = 0; i < raceArray.length; i++) {
    disp.push({
        name: "Item-Info-Hide",
        sign: "+"
    });
}
//console.log(boolArray)

const [style, setStyle] = useState(disp);
//console.log(isShown)
const showAthleteInfo = (event,index) => {
    let temp_state = [...style];
    let temp_element = { ...temp_state[index] };
    if (temp_element.name=="Item-Info-Hide") {
        temp_element.name = "RaceItem-Info-Show";
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
            <div className="Page-Heading">
                    My Races
            </div>
            <div className="Page-Box">
                <div className="Box-Header">
                    <div style={{float:"left"}}>Athelete Races</div>
                </div>
                <div className="Add-Item">
                    <Button style={{float:"left"}} type="add-button" label="+ Add A Race"/>
                </div>         
                <div className="Item-List">
                    {raceArray.length >= 1 && (
                        Array.from({length: raceArray.length}).map((_, index) => (
                            <div style={{paddingBottom: "15px"}}>
                                <div className="RaceItem-Container">
                                    <button className="Item-Plus" onClick={event => showAthleteInfo(event, index)}>
                                        {style[index].sign}
                                    </button>
                                    <div className="Item-Name">{raceArray[index].raceName}</div>
                                    <div className="races-button1">
                                        <Button type="races-select-button" label="Update Race"/>
                                    </div>
                                    <div className="races-button2">
                                        <Button type="races-select-button" label="Duplicate Race"/>
                                    </div>
                                    <div className="races-button3">
                                        <Button type="races-select-button" label="Delete Race"/>
                                    </div>
                                </div>
                                <div className={style[index].name}>
                                    <div className="racesCol1">Course</div>
                                    <div className="racesCol2">{raceArray[index].raceName}</div>
                                    <div className="racesCol3">Distance</div>
                                    <div className="racesCol4">{raceArray[index].distance}</div>
                                    <div className="racesCol1">Time</div>
                                    <div className="racesCol2">{raceArray[index].time}</div>
                                    <div className="racesCol3">Avg. Speed</div>
                                    <div className="racesCol4">{raceArray[index].avgspeed}</div>
                                    <div className="racesCol1">Avg. Power</div>
                                    <div className="racesCol2">{raceArray[index].avgpower}</div>
                                    <div className="racesCol3">Normalized Power</div>
                                    <div className="racesCol4">{raceArray[index].normalized_power}</div>
                                    <div className="racesCol1">Variability Index</div>
                                    <div className="racesCol2">{raceArray[index].variability_index}</div>
                                    <div className="racesCol3">Intensity Factor</div>
                                    <div className="racesCol4">{raceArray[index].intensity_factor}</div>
                                    <div className="racesCol1">Training Stress Score</div>
                                    <div className="racesCol2">{raceArray[index].stress_score}</div>
                                    <div className="racesCol3">Watts/Kg</div>
                                    <div className="racesCol4">{raceArray[index].watts_kg}</div>
                                    <div className="racesCol1">Avg. Yaw Angle</div>
                                    <div className="racesCol2">{raceArray[index].avg_yaw_angle}</div>
                                    <div className="racesCol3">Bike</div>
                                    <div className="racesCol4">{raceArray[index].bike}</div>
                                    <div className="Race-Plan-Details"><Button type="View-Plan-Details-Button" label="View Race Plan Details"/></div>
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
  
  export default MyRaces;