"use client";

import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "../login/login.css";
import axios from "axios";
import { useAuth } from "../../lib/auth";
import { AUTH_API } from "@/lib/constants/apiUrl";

import "./register.css";
const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { setAuthState } = useAuth();

  // handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // --------add user------------------

  const addUser = async (e) => {
    try {
      e.preventDefault();
      if (
        !name.trim() ||
        !email.trim() ||
        !password ||
        password.length < 8 ||
        password !== conformpassword
      ) {
        setError(true);
        toast.error("Please fill all required fields correctly");
        return;
      } else {
        setError(false);
      }
      if (password !== conformpassword) {
        setError(true);
        toast.error("password not match");
        return;
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("bio", bio);
        if (selectedImage) {
          formData.append("profile", selectedImage);
        }
        const res = await axios.post(AUTH_API.REGISTER, formData);
        console.log("added user", res.data.AccessToken);
        toast.success("user Created!!");

        setAuthState(res.data.AccessToken, res.data.userData);

        setConformpassword("");
        setEmail("");
        setName("");
        setPassword("");
        setSavedPassword("");
        setRole("");
        setBio("");
        setSelectedImage(null);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.message) {
          toast.error(err.response.data.message);
        } else if (err.response.data.msg) {
          const errors = err.response.data.msg;
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              toast.error(errors[key]);
            }
          }
        }
      } else {
        toast.error(err, "something went wrong in signup page");
        console.log(err, "error is in the registration fr");
      }
    }
  };

  const DEFAULT_IMAGE = "/profile.jpg";
  return (
    <form action="">
      <div className="login">
        &nbsp;
        <ToastContainer theme="colored" />
        <div className="section">
          <div className="cnt1">

            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : DEFAULT_IMAGE
              }
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <div className="profine">
              <input
                type="file"
                accept="image/*"
                className="textEditField"
                onChange={handleImageChange}
                multiple={false}
              />
            </div>

            <TextField
              className="text"
              label="name"
              value={name}
              color="secondary"
              //   focused
              error={error && !name.trim()}
              helperText={error && !name.trim() ? "Username is required" : ""}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              className="text"
              label="email"
              color="secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //   focused
              error={
                error &&
                (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              }
              helperText={
                error && !email.trim()
                  ? "Email is required"
                  : error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Invalid email format"
                  : ""
              }
              required
            />
            <div className="select">
              <select
                className="select-button"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <TextField
              className="text"
              label="bio"
              value={bio}
              color="secondary"
              //   focused
              error={error && !bio.trim()}
              onChange={(e) => setBio(e.target.value)}
            />

            <TextField
              className="text"
              label="password"
              color="secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              //   focused
              error={error && (!password || password.length < 8)}
              helperText={
                error && !password
                  ? "Password is required"
                  : error && password.length < 8
                  ? "Password must be at least 8 characters"
                  : ""
              }
              required
            />

            <TextField
              className="text"
              label="Conform-Password"
              color="secondary"
              value={conformpassword}
              onChange={(e) => setConformpassword(e.target.value)}
              //   focused
              error={Boolean(
                error && password !== conformpassword
                  ? "Passwords do not match"
                  : ""
              )}
              helperText={
                error &&
                (password !== conformpassword ? "Passwords do not match" : "")
              }
              required
            />

            <Button
              type="submit"
              className="submit"
              variant="contained"
              onClick={addUser}
            >
              submit
            </Button>
            <Typography variant="body2" className="signin-text">
              Already have an account?<Button href="/login">login</Button>
            </Typography>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;
