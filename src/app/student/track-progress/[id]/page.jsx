"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import "./trackProgress.css";
import { useAuth } from "@/lib/auth";

const TrackProgressPage = () => {
  const { id: courseId } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const courseRes = await axios.get(
          `${STUDENT_API.SINGLE_COURSE}?id=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(courseRes.data.data, "++++++++++");
        setCourse(courseRes.data?.data || null);

        const lectureRes = await axios.get(
          `${STUDENT_API.VIEW_LECTURE}?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLectures(lectureRes.data?.lecture || []);

        const progressRes = await axios.get(
          `${STUDENT_API.TRACK_PROGRESS}?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompletedLectures(progressRes.data?.completedLectures || []);
        setProgress(progressRes.data?.progress || 0);
      } catch (error) {
        console.error(
          "Track progress error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  if (loading) {
    return <p className="text-center mt-10">Loading course progress...</p>;
  }

  if (!course) {
    return <p className="text-center mt-10">Course not found</p>;
  }

  return (
    <div className="track-progress-container">
      <div className="track-progress-breadcrumb">
        Dashboard / {course.title}
      </div>

      <div className="course-card">
        <img
          src={`${API_BASE_URL}${course.thumbnail}`}
          className="course-thumbnail"
          alt=""
        />

        <div className="course-info">
          <h2>{course.title}</h2>
          <p>
            Instructor:{" "}
            <span className="font-semibold">
              {course.instructor?.name || "N/A"}
            </span>
          </p>
          <p>{course.description}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <p>Total Lectures</p>
          <p>{lectures.length}</p>
        </div>

        <div className="stats-card">
          <p>Completed Lectures</p>
          <p>{completedLectures.length}</p>
        </div>

        <div className="stats-card">
          <p>Lessons Completed</p>
          <p>
            {completedLectures.length} / {lectures.length}
          </p>
        </div>

        <div className="stats-card">
          <p>Your Progress</p>
          <p>{progress}%</p>
        </div>
      </div>

      <div className="progress-card">
        <div className="flex justify-between mb-2">
          <p className="font-semibold">Course Progress</p>
          <p>{progress}%</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="detailed-progress">
        <h3 className="font-semibold mb-4">Detailed Progress</h3>

        <ul>
          {lectures.map((lec) => {
            const isCompleted = completedLectures.includes(lec._id);

            return (
              <li key={lec._id}>
                <span
                  className={isCompleted ? "completed-icon" : "pending-icon"}
                >
                  {isCompleted ? "✔" : "○"}
                </span>
                <span>
                  {lec.title} {isCompleted ? "(Completed)" : "(Pending)"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={() => router.back()} className="back-button">
        Back to Course
      </button>
    </div>
  );
};

export default TrackProgressPage;
