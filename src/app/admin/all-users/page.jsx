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
  return (
    <div>
      
    </div>
  )
}

export default page
