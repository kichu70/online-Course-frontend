"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "./allLectures.css";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/lib/auth";
import { ADMIN_API } from "@/lib/constants/apiUrl";
import Image from "next/image";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "@/lib/constants/apiUrl";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const [refresh, setRefresh] = useState(false);

  const { token, user, logout } = useAuth();

  const [totalLecture, setTotalLecture] = useState(0);
  const [lecture, setLecture] = useState([]);

  // =============all lectures=================================

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await axios.get(`${ADMIN_API.ALL_LECTURES}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalLecture(res.data.totalLecture);
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setLecture(idReplace);
        console.log(idReplace);
      } catch (err) {
        console.log(err, "error is in the fetchLecture fr");
      }
    };
    fetchLecture();
  }, [refresh, token, user]);
  // ---------delete active lecture-------------
  const lectureCourse = async (id) => {
    try {
      const res = await axios.put(
        `${ADMIN_API.DELETE_REACTIVATE_LECTURE}?lectureId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the delete lecture admin fr");
    }
  };

  return (
    <div>
      <div className="allLecture">
        <div className="section2">
          <div className="section-title">
            Lecture Management

          </div>
          <div className="section-box2">
            <table className="admin-table2">
              <thead>
                <tr>
                  <th>video</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>delete/active</th>
                </tr>
              </thead>
              <tbody>
                {lecture.map((lecture, index) => (
                  <tr key={index}>
                    <td>
                      <video
                        src={`${API_BASE_URL}${lecture.video_url}`}
                        alt={lecture.title}
                        className="course-avatar"
                        width={150}
                        height={150}
                      />
                    </td>
                    <td>{lecture.title}</td>
                    <td>{lecture.instructor.name}</td>
                    <td>
                      <span
                        className={`status-dot2 ${
                          lecture.is_deleted ? "inactive" : "active"
                        }`}
                      ></span>
                      <Button
                        variant="contained"
                        className={`btn ${
                          lecture.is_deleted ? "btn2-inactive" : "btn2-active"
                        }`}
                        onClick={() => lectureCourse(lecture.id)}
                      >
                        {lecture.is_deleted ? "Activate" : "Delete"}
                      </Button>
                      {lecture.is_deleted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
