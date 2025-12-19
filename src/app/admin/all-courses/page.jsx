"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "./allCourse.css";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/lib/auth";
import { ADMIN_API } from "@/lib/constants/apiUrl";
import Image from "next/image";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "@/lib/constants/apiUrl";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const { token, user, logout } = useAuth();

  const [refresh, setRefresh] = useState(false);

  const [totalCourse, setTotalCourse] = useState(0);
  const [course, setCourse] = useState([]);

  // ============================course managnent=======================

  // list course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${ADMIN_API.ALL_COURSES}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setCourse(idReplace);
        setTotalCourse(res.data.totalCourse);
      } catch (err) {
        console.log(err, "error is in the fetch course  in the fr");
      }
    };
    fetchCourse();
  }, [refresh, token, user]);

  // --------------delete reactivate course---------------

  const DeleteCourse = async (id) => {
    try {
      const res = await axios.put(
        `${ADMIN_API.DELETE_REACTIVATE_COURSE}?courseId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the delete course admin fr");
    }
  };
  // --------------aprove reject course---------------

  const approveCourse = async (id) => {
    try {
      const res = await axios.put(
        `${ADMIN_API.TOGGLE_COURSE_STATUS}?courseId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the delete course admin fr");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="all-courses1">
        &nbsp;
        <div className="section1">
          <div className="section-title1">
            <h4>Course Management</h4>
            <Button className="view-all-users">view all</Button>
          </div>
          <div className="section-box1">
            <table className="admin-table1">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Total Lectures</th>
                  <th>delete/active</th>
                  <th>delete/active</th>
                </tr>
              </thead>
              <tbody>
                {course.map((courseItem, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={`${API_BASE_URL}${courseItem.thumbnail}`}
                        alt={courseItem.title}
                        className="course-avatar1"
                        height={150}
                      />
                    </td>
                    <td>{courseItem.title}</td>
                    <td>{courseItem.instructor.name}</td>
                    <td>{courseItem.total_lectures}</td>
                    <td>
                      <span
                        className={`status-dot1 ${
                          courseItem.is_deleted ? "inactive" : "active"
                        }`}
                      ></span>
                      <Button
                        variant="contained"
                        className={`btn ${
                          courseItem.is_deleted
                            ? "btn-inactive1"
                            : "btn-active1"
                        }`}
                        onClick={() => DeleteCourse(courseItem.id)}
                      >
                        {courseItem.is_deleted ? "Activate" : "Delete"}
                      </Button>
                    </td>

                    <td>
                      <span
                        className={`status-dot1 ${
                          courseItem.status === "approved"
                            ? "active"
                            : courseItem.status === "rejected"
                            ? "inactive"
                            : "pending-dot"
                        }`}
                      ></span>
                      <Button
                        variant="contained"
                        className={`btn ${
                          courseItem.status === "approved"
                            ? "btn-approved1"
                            : courseItem.status === "rejected"
                            ? "btn-rejected1"
                            : "btn-pending1"
                        }`}
                        onClick={() => approveCourse(courseItem.id)}
                      >
                        {courseItem.status === "approved"
                          ? "Approved"
                          : courseItem.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </Button>
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
