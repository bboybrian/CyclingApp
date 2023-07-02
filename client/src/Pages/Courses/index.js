import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MainContainer from "Core/container";
import Header from "Header";
import Footer from "Core/footer";
import DashboardToolbar from "../Dashboard/dashboardToolbar";
import "./Courses.css";
import Button from "Button";
import FormData from 'form-data'
import UploadCourse from "./CourseComponents/UploadCourse";
import backend from "axios_config";

const CoursePage = () => {

    const [courses, setCourses] = useState([]);
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const navigate = useNavigate();

    const refreshCourseList = () => {
        backend.get("/users/get-all-courses").then(response => {
            setCourses(response);
        });
    };

    useEffect(() => {
        refreshCourseList();
    }, []);

    const uploadGpx = (courseName, file) => {
        (async() => {
            if (!file) {
                alert("Error: No file found");
            } else if (!courseName) {
                alert("Error: Please select a type");
            } else {
                var data = new FormData();
                console.log(file)
                data.append('gpx', file);
                data.append('name', courseName);
    
                try {
                    const response = await backend.post("/users/upload-course", data, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (response.status === 200) {
                        refreshCourseList();
                    } 
                } catch(e) {
                    alert(e.response.data);
                }
            }
        })();
      };

    const deleteCourse = (racecourseId) => {
        if(racecourseId) {
            const request = {
                racecourseId: racecourseId
            };

            backend.delete(`/users/course`, {data:request}).then(() => {
                refreshCourseList();
            });
        }
    }

    const renderedCourses = () => {

        return courses?.data?.recordset.map((value) => {
            return [
                    <div className="course_grid_row">{value?.name ?? "-"}</div>,
                    <div className="course_grid_row">{value?.distance ?? "-"} mi</div>,
                    <div className="course_grid_row">{value?.city ?? "-"}</div>,
                    <div className="course_grid_row">{value?.state ?? "-"}</div>,
                    <div className="course_grid_row">{value?.country ?? "-"}</div>,
                    <div className="course_grid_row">
                        <Button label={"View"} onClick={() => {
                            if(value?.ID) {
                                navigate(`./view/${value.ID}`);
                            }
                        }}/>
                        <Button label={"Delete"} onClick={() => deleteCourse(value.ID)}/>
                    </div>
            ];
        }) ?? <></>;
    }  

    return (
        <MainContainer>
            <Header>
                <DashboardToolbar/>
            </Header>
            <div className="Page-Content">
                <div className="Page-Box_Course">
                    <div className="Box-Header">
                        <div style={{float:"left"}}>Athlete Courses</div>
                    </div>
                    {!showUploadPanel ? 
                    <Button
                        label="Upload Course" 
                        type="Upload-Course-Button expanded_button" 
                        onClick={() => setShowUploadPanel(true)}>
                    </Button>
                    : <UploadCourse uploadFile={uploadGpx} closePanel={() => setShowUploadPanel(false)}/>}
                    <div className="course_grid">
                        <div className="course_grid_header">{"Course"}</div>
                        <div className="course_grid_header">{"Distance"}</div>
                        <div className="course_grid_header">{"City"}</div>
                        <div className="course_grid_header">{"State"}</div>
                        <div className="course_grid_header">{"Country"}</div>
                        <div className="course_grid_header"/>
                        {renderedCourses()}
                    </div>
                </div>
            </div>
            <Footer/>
    </MainContainer>
    )
}
  
  export default CoursePage;