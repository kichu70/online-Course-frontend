"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { STUDENT_API } from "@/lib/constants/apiUrl";

const Success = () => {
  const router = useRouter();
  const { token } = useAuth();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
  if (!sessionId) return;
  if (!token) {
    const timeout = setTimeout(() => {
        window.location.reload();
      }, 10);
      return () => clearTimeout(timeout);
  }else{
    handlePaidEnroll();
  }
}, [sessionId, token]);

  const handlePaidEnroll = async () => {
    try {
      const res = await axios.post(
        `${STUDENT_API.PAID_ENROLL}?session_id=${sessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data, "Payment Enrollment Data");

      // mark session processed
      sessionStorage.setItem(`paid_${sessionId}`, "true");

      toast.success("Payment Successful 🎉");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.log(err, "Error in paid enrollment");
      toast.error("Payment verified but enrollment failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful!</h1>
      <p>Processing your enrollment...</p>
    </div>
  );
};

export default Success;
