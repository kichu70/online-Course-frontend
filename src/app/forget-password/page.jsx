"use client";

import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./forgetPassword.css";
import { AUTH_API } from "@/lib/constants/apiUrl";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      return;
    }

    setError(false);

    try {
      const res = await axios.post(`${AUTH_API.FORGOT_PASSWORD}`, { email });
      toast.success(res.data.message); 
      // Redirect to verify OTP page after 1.5 seconds
      setTimeout(() => {
        router.push(`/verify-otp?email=${email}`);
      },);
    } catch (err) {
      console.log(err.response?.data?.message || "Something went wrong!");
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit}> 
      <div className="login">
        &nbsp;
        <div className="section">
          <div className="cnt1">
            <h2 className="forget-head">Forgot Password</h2>
            <TextField
              className="text"
              label="Email"
              color="secondary"
              onChange={(e) => setEmail(e.target.value)}
              error={error && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
              helperText={
                error && !email.trim()
                  ? "Email is required"
                  : error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Invalid email format"
                  : ""
              }
              required
            />
            <Button type="submit" className="submit">
              Submit
            </Button>
           
          </div>
        </div>
        &nbsp;
      </div>
    </form>
  );
}
