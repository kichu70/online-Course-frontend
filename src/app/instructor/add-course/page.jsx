"use client";

import React, { useRef, useState } from "react";
import "./add-course.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { INSTRUCTOR_API } from "@/lib/constants/apiUrl";
import { useAuth } from "@/lib/auth";

import Navbar from "@/components/navbar/Navbar"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddCoursePage = () => {
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await axios.post(INSTRUCTOR_API.ADD_COURSE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res,"course is created !! ")
      toast.info("Course created successfully!");
      setErrors({});
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setThumbnail(null);
      setPreview(null);
      setTimeout(() => {
        router.back();
      }, 1500);
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
      <Navbar/>
    <div className="add-course">
      <div className="add-course-sct1">
        {/* FORM LEFT SIDE */}
        <div className="add-sct1-cnt1">
          <TextField
            label="Title"
            variant="filled"
            className="textEditField"
            focused
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title ? true : false}
            helperText={errors.title}
          />

          {/* CATEGORY */}
          <select
            id="category"
            name="category"
            className="selectBox"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="BCA">BCA</option>
            <option value="B-come">B-come</option>
            <option value="BA">BA</option>
            <option value="BBA">BBA</option>
          </select>
          {errors.category && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.category}</p>
          )}

          <TextField
            label="Description"
            variant="filled"
            focused
            className="textEditField"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description ? true : false}
            helperText={errors.description}
          />

          <TextField
            label="Price"
            variant="filled"
            focused
            type="number"
            className="textEditField"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price ? true : false}
            helperText={errors.price}
          />
        </div>

        {/* IMAGE UPLOAD RIGHT SIDE */}
        <div className="add-sct1-cnt2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="textEditField"
            onChange={handleImageChange}
          />
          {errors.thumbnail && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.thumbnail}</p>
          )}

          {preview && (
            <>
              <img
                src={preview}
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
              <button
                id="xBtn"
                onClick={() => {
                  setPreview(null);
                  setThumbnail(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                x
              </button>
            </>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button onClick={handleSubmit} className="submitBtn">
        Create Course
      </button>
    </div>
    </>
  );
};

export default AddCoursePage;
