import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MainContainer from "Core/container";
import Input from "Input"
import Header from "Header";
import Footer from "Core/footer";
import DashboardToolbar from "../../Dashboard/dashboardToolbar";
import Map from "Map";
import CourseField from "../CourseComponents/CourseField";
import "../Courses.css";
import Button from "Button";
import backend from "axios_config";

const ViewCourse = () => {
    const [gpxFile, setGpxFile] = useState(null);
    const [courseName, setCourseName] = useState(null);
    const [distance, setDistance] = useState("-");
    const [elevation, setElevation] = useState("-");
    const [location, setLocation] = useState("-");
    const [fileReader, setFileReader] = useState();
    const [newGpxFile, setNewGpxFile] = useState(null);

    const { courseID } = useParams();
    const navigate = useNavigate();

    const updateCourseStatistics = () => {
        backend.get(`/users/get-course?racecourseId=${courseID}`, {
            headers: {
                'Accept-Encoding': "gzip, deflate, br"
            }
        }).then((courseData) => {
            console.log(courseData);
            const data = courseData?.data?.recordset[0];
            if(data) {
                setCourseName(data?.name ?? "-");
                setGpxFile(data?.gpx ? JSON.parse(data?.gpx) : "-");
            } else {
                console.error("Invalid course data");
            }
        });
    }

    const returnGpx = gpx => {
        setNewGpxFile(gpx);
    };

    useEffect(() => {
    }, [newGpxFile]);
    
    useEffect(() => {
        updateCourseStatistics();
    }, []);

    useEffect(() => {
        if(fileReader?.result) {
            setGpxFile(fileReader.result);
            updateCourseStatistics();
        }
    }, [fileReader]);

    const updateCourse = () => {
        const request = {
            racecourseId: courseID,
            updatedCourseName: courseName,
            gpx: newGpxFile == 0 ? gpxFile : newGpxFile
        };

        // update course segments
        backend.post("/users/replace-course", request).then((response) => {
            console.log(response);
            if(response.status === 200) {
                navigate("/course");
            } else {
                alert(response.statusText);
            }
        })

        // update course name
        backend.put("/users/course", request).then((response) => {
            console.log(response);
            if(response.status === 200) {
                navigate("/course");
            } else {
                alert(response.statusText);
            }
        })
    }

    return (
        <MainContainer>
            <Header>
                <DashboardToolbar/>
            </Header>
            <div className="Page-Content">
                <div className="Page-Box">
                    <div className="Box-Header">
                        <div style={{float:"left"}}>Athlete Courses</div>
                    </div>
                    <div className="CoursePage_PagePositioning">
                        <div className="CousePage_CourseInfo">
                            <div className="CousePage_InfoForm">
                                <CourseField label={"Course Name"}>
                                    <Input 
                                        className="form-input" 
                                        placeholder="Course Name" 
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}>
                                            {courseName}
                                    </Input>
                                </CourseField>
                                <CourseField label={"Distance"}>{distance}</CourseField>
                                <CourseField label={"Effective Elevation"}>{elevation}</CourseField>
                                <CourseField label={"Location"}>{location}</CourseField>
                                <CourseField customStyle={{borderBottom: "0.5px solid #ACB3BF"}} label={"File"}>
                                    <Input></Input>
                                </CourseField>
                            </div>
                            <Map gpxFile={gpxFile} selections={true} viewOnly={false} returnGpx={returnGpx}></Map>
                        </div>
                        <div className="CousePage_CourseNavigation">
                                <Button label="Back" type="secondary" onClick={()=> navigate(-1)}></Button>
                                <Button label="Update" type="primary" onClick={()=> updateCourse()}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
    </MainContainer>
    )
}
  
export default ViewCourse;