"use client";

import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./EditCourse.css";
import axios from "axios";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import { useAuth } from "@/lib/auth";

import { toast } from "react-toastify";
import { title } from "process";

const EditCourse = ({ open, course, id, onClose }) => {
  const { token } = useAuth();

  const notify3 = () => toast.dark("dataUpdated");
  const editboxRef = useRef();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (course) {
      setCourseName(course.title || "");
      setCourseDescription(course.description || "");
      setCoursePrice(course.price || "");
    }
  }, [course]);

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const UpdateCourse = async () => {
    try {
      const formData = new FormData();
      formData.append("title", courseName);
      formData.append("description", courseDescription);
      formData.append("price", coursePrice);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await axios.put(
        `${INSTRUCTOR_API.UPDATE_COURSE}?id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, id);
      notify3();
      const updated = res.data.data;
      onClose({ id: updated._id, ...updated });
    } catch (err) {
      const errors = err.response?.data?.msg;
      if (errors) {
        Object.values(errors).forEach((errorMsg) => {
          toast.error(errorMsg);
        });
      } else {
        toast.error("Something went wrong");
      }
      console.log(err, "something went wrong ");
    }
  };
  useEffect(() => {
    const handClickOutside = (event) => {
      if (editboxRef.current && !editboxRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handClickOutside);
    return () => document.removeEventListener("mousedown", handClickOutside);
  }, [onClose]);

  return (
    <div className="main-edit" ref={editboxRef}>
      {/* <Button variant='contained' className='closebtn'onClick={onClose}>X</Button> */}
      <div className="edit">
        <h1>Edit Product</h1>
        <div className="edit-colums">
          <TextField
            onChange={(e) => setCourseName(e.target.value)}
            value={courseName}
            className="textEditField"
            label="course name"
            variant="filled"
            focused
          />
          <TextField
            onChange={(e) => setCourseDescription(e.target.value)}
            value={courseDescription}
            className="textEditField"
            label="Description"
            variant="filled"
            focused
          />
          <TextField
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            className="textEditField"
            label="Price"
            variant="filled"
            type="number"
            focused
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            className="updatebtn"
            onClick={() => {
              UpdateCourse();
            }}
            variant="contained"
          >
            update course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
