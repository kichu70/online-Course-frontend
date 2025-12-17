"use client";

import React, { useRef, useState } from "react";
import "./addLecture.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { INSTRUCTOR_API } from "@/lib/constants/apiUrl";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const AddLecturePage = () => {
  const { token } = useAuth();
const {id: courseId } = useParams();
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  const router = useRouter();
  

  
const handleVideoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  //  LARGE FILE POPUP (ON SELECT)
  if (file.size > MAX_FILE_SIZE) {
    toast.error("Video size must be less than 50MB");

    // reset input & state
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setVideo(null);
    setVideoName("");
    setPreview(null);
    return; //  STOP HERE
  }

  //  VALID FILE
  setVideo(file);
  setVideoName(file.name);
  setPreview(URL.createObjectURL(file));
};


  // Submit Handler
  const handleSubmit = async () => {
    try {
      if (!video) {
        toast.error("Video file is required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("video", video);

      const res = await axios.post(
        `${INSTRUCTOR_API.ADD_LECTURE}?courseId=${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Lecture added successfully!");
      setTitle("");
      setVideo(null);
      setVideoName("");
      setPreview(null);
      setErrors({});
      router.back()
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.log(err);

      if (err.response?.data?.msg) {
        setErrors(err.response.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-lecture">
        <h1>add lecture</h1>
        <div className="add-lecture-sct1">
          {/* LEFT SIDE */}
          <div className="add-lecture-cnt1">
            <TextField
              label="Lecture Title"
              variant="filled"
              focused
              className="textEditField"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title ? true : false}
              helperText={errors.title}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="add-lecture-cnt2">
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              className="textEditField"
              onChange={handleVideoChange}
            />

            {videoName && (
          <video
                src={preview}
                controls
                style={{ width: "250px", marginTop: "10px" }}
              />
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button onClick={handleSubmit} className="submitBtn">
          Add Lecture
        </button>
      </div>
    </>
  );
};

export default AddLecturePage;
