"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { STUDENT_API } from "@/lib/constants/apiUrl";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "./courseReview.css";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";

export default function CourseReviewPage() {
  const { courseId } = useParams();
  const { token } = useAuth();
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId || !token) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${STUDENT_API.TRACK_PROGRESS}?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProgress(res.data.progress);
      } catch (error) {
        toast.error("Failed to fetch progress");
      }
    };

    fetchProgress();
  }, [courseId, token]);

  const submitReview = async () => {
    if (!rating) {
      toast.warning("Please select a rating");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${STUDENT_API.ADD_REVIEW}?courseId=${courseId}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setRating(0);
      setComment("");
      router.back();
    } catch (error) {
        toast.error(error.response?.data?.message || "Error adding review");
        setTimeout(() => {
        router.back();
      }, 1500);

    } finally {
      setLoading(false);
    }
  };

  //---------------Redirect if no course found-------------------------------------
  useEffect(() => {
    if ( progress < 100) {
      const timer = setTimeout(() => {
        router.back();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, progress, router]);

  return (
    <>
      <Navbar />

      <div className="review-container">
        <h2>Course Progress</h2>
        <p>{progress}% completed</p>

        {progress === 100 ? (
          <div className="review-box">
            <h3>Add Review</h3>

            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`review-star ${num <= rating ? "active" : ""}`}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="review-textarea"
              placeholder="Write your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              className="add-review-btn"
              onClick={submitReview}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <p className="locked-msg">Complete the course to add a review</p>
        )}
      </div>
    </>
  );
}
