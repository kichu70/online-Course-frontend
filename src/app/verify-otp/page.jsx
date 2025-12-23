"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_API } from "@/lib/constants/apiUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./verifyOtp.css";
import Button from "@mui/material/Button";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(new Array(6).fill("")); // 6-digit OTP
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const res = await axios.post(AUTH_API.VERIFY_OTP, { email, otp: otpValue });
      toast.success(res.data.message || "OTP verified");
      router.push(`/reset-password?email=${email}&otp=${otpValue}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      console.log(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(AUTH_API.FORGOT_PASSWORD, { email });
      toast.success(res.data.message || "OTP resent successfully");
      setOtp(new Array(6).fill("")); // clear input boxes
      inputsRef.current[0].focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
      console.log(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>
        <Button type="submit">Verify</Button>
      </form>
      <Button onClick={handleResendOtp} style={{ marginTop: "10px" }}>
        Resend OTP
      </Button>
    </div>
  );
}
