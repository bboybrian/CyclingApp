import { useState } from "react";
import Input from "Input";
import Button from "Button";

const UploadCourse = ({uploadFile, closePanel}) => {

    const [courseName, setCourseName] = useState("");
    const [file, setFile] = useState(null);

    return (
        <div className="uploadCourseComponent">
            <div className="Box-Header uploadHeader">
                <div style={{textAlign:"left", minWidth: "94.5%"}}>Upload Course</div>
                <Button 
                    label="X" 
                    type="Upload-Course-Button expanded_button" 
                    onClick={() => closePanel()}></Button>
            </div>
            <div className="uploadInput">
                <div className="uploadCourseTitle">Course Name</div>
                <Input className="form-input" placeholder="Course Name" 
                    onChange={(e) => setCourseName(e.target.value)}>
                        {courseName}
                </Input>
            </div>
            <div className="uploadInput">
                <div className="uploadCourseTitle">File Upload</div>
                <div className="form-input">
                    <Input type={"file"} onChange={(e) => setFile(e.target.files[0])}></Input>
                </div>
            </div>
            <div className="uploadInput">
                <Button label="Save Course" type="expanded_button" onClick={() => uploadFile(courseName, file)}></Button>
            </div>
        </div>
    );
}

export default UploadCourse;