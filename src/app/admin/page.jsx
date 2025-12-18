"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "./adminHome.css";

import { useAuth } from "@/lib/auth";
import { ADMIN_API } from "@/lib/constants/apiUrl";
import defult_profile from "../../../public/profile.jpg";
import Image from "next/image";
import Button from "@mui/material/Button";

const page = () => {
  const { token,  user,logout } = useAuth();

  const [refresh, setRefresh] = useState(false);

  const [totalUser, setTotalUser] = useState(0);
  const [users, setUsers] = useState([]);

  const [totalCourse, setTotalCourse] = useState(0);
  const [course, setCourse] = useState([]);

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
        setUsers(idReplace.slice(0, 4));
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
        setTotalCourse(res.data.totalCourse);

        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        console.log(res.data)
        setCourse(idReplace.slice(0, 4));
        setTotalCourse(res.data.totalCourse)
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
      console.log(err, "error is in the delete user admin fr");
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar1">
        <div className="sidebar2">
          <div className="logo">Admin Panel</div>

          <div className="menu">
            <div className="menu-item">Dashboard</div>
            <div className="menu-item">Users</div>
            <div className="menu-item">Courses</div>
            <div className="menu-item">Lectures</div>
            <div className="menu-item">Settings</div>
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
            <div className="logout" onClick={logout}>Logout</div>
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
            <div className="card-value">120</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="sections">
          <div className="section1">
            <div className="section-title">
              <h4>User Management</h4>{" "}
              <Button className="view-all-users">view all</Button>
            </div>
            <div className="section-box">
              {users.map((user, index) => (
                <div className="lists" key={index}>
                  <div className="sct1">
                    <Image
                      src={user.profile_pic || defult_profile}
                      alt={user.name}
                      className="user-avatar"
                      width={50}
                      height={50}
                    />
                    <h4>{user.name}</h4>
                    <h4>{user.email}</h4>
                  </div>
                  <div className="sct2">{user.role}</div>
                  <div className="sct3">
                    <div className="btnsOfAdmin">
                      {/* Status dot */}
                      <span
                        className={`status-dot ${
                          user.is_deleted ? "inactive" : "active"
                        }`}
                      ></span>

                      <Button
                        variant="contained"
                        className={`btn ${
                          user.is_deleted ? "btn-inactive" : "btn-active"
                        }`}
                        onClick={() => DeleteUser(user.id)}
                      >
                        {user.is_deleted ? "Activate" : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section1">
            <div className="section-title">Course Management</div>
            <div className="section-box">
              {course.map((course, index) => (
                <div className="lists" key={index}>
                  <div className="sct1">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      className="course-avatar"
                      width={50}
                      height={50}
                    />
                    <h4>{course.title}</h4>
                    {/* <h4>{user.email}</h4> */}
                  </div>
                  <div className="sct2">dd</div>
                  <div className="sct3">
                    <div className="btnsOfAdmin">
                      {/* Status dot */}
                      <span
                        className={`status-dot ${
                          course.is_deleted ? "inactive" : "active"
                        }`}
                      ></span>

                      <Button
                        variant="contained"
                        className={`btn ${
                          course.is_deleted ? "btn-inactive" : "btn-active"
                        }`}
                        onClick={() => DeleteCourse(course.id)}
                      >
                        {course.is_deleted ? "Activate" : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section1">
            <div className="section-title">Lecture Management</div>
            <div className="section-box">
              View / Delete / Reactivate Lectures
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
