import React from 'react';

const CourseField = ({label, children, customStyle}) => {
    return (
        <div style={customStyle} className="CoursePage_FormField">
            <div>{label}</div>
            <div>{children}</div>
        </div>
    );
}

export default CourseField;