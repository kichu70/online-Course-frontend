"use client";

import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./EditCourse.css";
import axios from "axios";
import { useAuth } from "@/lib/auth";

import { toast } from "react-toastify";

const EditCourse = ({ open, course, id, onClose }) => {
  const { token } = useAuth();

  const notify3 = () => toast.dark("dataUpdated");
  const editboxRef = useRef();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");

  useEffect(() => {
    if (course) {
      setCourseName(course.title || "");
      setCourseDescription(course.description || "");
      setCoursePrice(course.price || "");
    }
  }, [course]);
  const UpdateCourse = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/Books/upadte-book?id=${id}`,
        {
          book_name: courseName,
          description: courseDescription,
          price: coursePrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, id);
      notify3();
      onClose(res.data.data);
    } catch (err) {
      alert(err, "error is in the update ");
      console.log(err, "error is in the update ");
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
          <Button
            className="updatebtn"
            onClick={() => {
              UpdateCourse();
            }}
            variant="contained"
          >
            update Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
