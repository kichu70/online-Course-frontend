"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_API } from "@/lib/constants/apiUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./resetPassword.css"; // create CSS similar to verifyOtp.css

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const handleReset = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(AUTH_API.RESET_PASSWORD, {
        email,
        otp,
        newPassword: password,
      });
      toast.success(res.data.message || "Password reset successful");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
      console.log(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset} className="reset-form">
        <TextField
          type="password"
          label="New Password"
          color="secondary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          helperText="Minimum 8 characters"
        />
        <TextField
          type="password"
          label="Confirm Password"
          color="secondary"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="secondary">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
