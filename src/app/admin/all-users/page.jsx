"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import "./allUsers.css";
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
  const [totalUser, setTotalUser] = useState(0);
  const [users, setUsers] = useState([]);
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
        setUsers(idReplace);
        console.log(idReplace);
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
  return (
    <div>
      <Navbar />
      <div className="allUsers">
        <div className="section2">
          <div className="section-title">
            <h4>User Management</h4>
          </div>
          <div className="section-box2">
            <table className="admin-table2">
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
                        className="user-avatar2"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`status-dot2 ${
                          user.is_deleted ? "inactive" : "active"
                        }`}
                      ></span>
                    </td>
                    <td>
                      <Button
                        variant="contained"
                        disabled={user.role === "admin"}
                        className={`btn2 ${
                          user.is_deleted ? "btn2-inactive" : "btn2-active"
                        }`}
                        onClick={() => DeleteUser(user.id)}
                      >
                        {user.role === "admin"
                          ? "Admin"
                          : user.is_deleted
                          ? "Activate"
                          : "Delete"}
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
