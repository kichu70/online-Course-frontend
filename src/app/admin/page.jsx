"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "./adminHome.css";

import { useAuth } from "@/lib/auth";
import { ADMIN_API } from "@/lib/constants/apiUrl";
import defult_profile from "../../../public/profile.jpg";
import Image from "next/image";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "@/lib/constants/apiUrl";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const { token, user, logout } = useAuth();

  const [refresh, setRefresh] = useState(false);

  const [totalUser, setTotalUser] = useState(0);
  const [users, setUsers] = useState([]);

  const [totalCourse, setTotalCourse] = useState(0);
  const [course, setCourse] = useState([]);

  const [totalLecture, setTotalLecture] = useState(0);
  const [lecture, setLecture] = useState([]);

  // ------------------user data -----------------

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ADMIN_API.ALL_USERS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalUser(res.data.totalUser);

        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setUsers(idReplace.slice(0, 5));
      } catch (err) {
        console.log(err, "error is in the fetch user fr");
      }
    };
    fetchUser();
  }, [token, user, refresh]);

  // --------------delete reactivate user---------------

  const DeleteUser = async (id) => {
    try {
      const res = await axios.put(
        `${ADMIN_API.DELETE_REACTIVATE_USER}?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((p) => !p);
    } catch (err) {
      console.log(err, "error is in the delete user admin fr");
    }
  };

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
        console.log(res.data.data);
        setCourse(idReplace.slice(0, 5));
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
        console.log(idReplace);
        setLecture(idReplace.slice(0, 5));
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
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar1">
        <div className="sidebar2">
          <div className="logo">Admin Panel</div>

          <div className="menu">
            {/* <div className="menu-item">Dashboard</div> */}
            <div
              className="menu-item"
              onClick={() => router.push("/admin/users")}
            >
              Users
            </div>
            <div
              className="menu-item"
              onClick={() => router.push("/admin/all-courses")}
            >
              Courses
            </div>
            <div
              className="menu-item"
              onClick={() => router.push("/admin/all-lectures")}
            >
              Lectures
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div className="title">Dashboard</div>

          <div className="admin-info">
            <div className="admin-name">Admin</div>
            <div className="logout" onClick={logout}>
              Logout
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats">
          <div className="card users">
            <div className="card-title">Total Users</div>
            <div className="card-value">{totalUser}</div>
          </div>

          <div className="card courses">
            <div className="card-title">Total Courses</div>
            <div className="card-value">{totalCourse}</div>
          </div>

          <div className="card lectures">
            <div className="card-title">Total Lectures</div>
            <div className="card-value">{totalLecture}</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="sections">
          <div className="section1">
            <div className="section-title">
              <h4>User Management</h4>
              <Button className="view-all-users"onClick={()=>router.push("/admin/all-users")}>view all</Button>
            </div>
            <div className="section-box">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            user.profile_pic
                              ? `${API_BASE_URL}${user.profile_pic}`
                              : "/profile.jpg"
                          }
                          alt={user.name}
                          className="user-avatar"
                          width={50}
                          height={50}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`status-dot ${
                            user.is_deleted ? "inactive" : "active"
                          }`}
                        ></span>
                      </td>
                      <td>
                        <Button
                          variant="contained"
                          className={`btn ${
                            user.is_deleted ? "btn-inactive" : "btn-active"
                          }`}
                          onClick={() => DeleteUser(user.id)}
                        >
                          {user.is_deleted ? "Activate" : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section1">
            <div className="section-title">
              <h4>Course Management</h4>
              <Button className="view-all-users" onClick={()=>router.push("/admin/all-courses")}>view all</Button>
            </div>
            <div className="section-box">
              <table className="admin-table">
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
                          className="course-avatar"
                          width={50}
                          height={50}
                        />
                      </td>
                      <td>{courseItem.title}</td>
                      <td>{courseItem.instructor.name}</td>
                      <td>{courseItem.total_lectures}</td>
                      <td>
                        <span
                          className={`status-dot ${
                            courseItem.is_deleted ? "inactive" : "active"
                          }`}
                        ></span>
                        <Button
                          variant="contained"
                          className={`btn ${
                            courseItem.is_deleted
                              ? "btn-inactive"
                              : "btn-active"
                          }`}
                          onClick={() => DeleteCourse(courseItem.id)}
                        >
                          {courseItem.is_deleted ? "Activate" : "Delete"}
                        </Button>
                      </td>

                      <td>
                        <span
                          className={`status-dot ${
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
                              ? "btn-approved"
                              : courseItem.status === "rejected"
                              ? "btn-rejected"
                              : "btn-pending"
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

          <div className="section1">
            <div className="section-title">
              Lecture Management
              <Button className="view-all-users" onClick={()=>router.push("/admin/all-lectures")}>view all</Button>
            </div>
            <div className="section-box">
              <table className="admin-table">
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
                          className={`status-dot ${
                            lecture.is_deleted ? "inactive" : "active"
                          }`}
                        ></span>
                        <Button
                          variant="contained"
                          className={`btn ${
                            lecture.is_deleted ? "btn-inactive" : "btn-active"
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
    </div>
  );
};

export default page;
