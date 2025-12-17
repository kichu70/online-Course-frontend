"use client";

import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./EditLecture.css";
import axios from "axios";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import { useAuth } from "@/lib/auth";

import { toast } from "react-toastify";

const EditLecture = ({ open, lecture, id, onClose }) => {
  const { token } = useAuth();

  const notify3 = () => toast.dark("dataUpdated");
  const editboxRef = useRef();
  const [lectureName, setLectureName] = useState("");

  useEffect(() => {
    if (lecture) {
      setLectureName(lecture.title || "");

    }
  }, [lecture]);
  const UpdateLecture = async () => {
    try {
      const res = await axios.put(
        `${INSTRUCTOR_API.UPDATE_LECTURE}?courseId=${lecture.course}&lectureId=${id}`,
        {
          title: lectureName,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, id);
      notify3();
      onClose(res.data.data );
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
      <div className="edit">
        <h1>Edit lecture</h1>
        <div className="edit-colums">
          <TextField
            onChange={(e) => setLectureName(e.target.value)}
            value={lectureName}
            className="textEditField"
            label="lecture name"
            variant="filled"
            focused
          />

          <Button
            className="updatebtn"
            onClick={() => {
              UpdateLecture();
            }}
            variant="contained"
          >
            update lecture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
