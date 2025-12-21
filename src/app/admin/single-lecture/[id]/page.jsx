"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import "./singleLecture.css";
import { ADMIN_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import Navbar from "@/components/navbar/Navbar";
import EditLecture from "@/components/edit/EditLecture";
import Confirm from "@/components/confirmDelete/Confirm";
import { toast } from "react-toastify";

const page = () => {
  const params = useParams();
  const { token } = useAuth();
  const [refresh, setRefresh] = useState(false);

  const [lectureData, setLectureData] = useState([]);
  const lectureId = params?.id;
  const router = useRouter();

  // -----------fetch lecture data -----------------
  useEffect(() => {
    // console.log(token)
    try {
      if (!token) {
        return console.log("no token");
      } else {
        if (!lectureId) {
          return console.log("no lectureId");
        } else {
          const fetchdata = async () => {
            try {
              const res = await axios.get(
                `${ADMIN_API.SINGLE_LECTURE}?lectureId=${lectureId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const result = res.data.data;

              setLectureData(result);
            } catch (err) {
              console.log(err, "error is in the fetch data fr");
            }
          };
          fetchdata();
        }
      }
    } catch (err) {
      console.log(err, "error is in the fr lecture fetching");
    }
  }, [token, lectureId, refresh]);

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
      <Navbar />
      <div className="lecture">
        <div className="lctr-sct1-cnt1">
          <div key={lectureData._id} sx={{ maxWidth: 445 }} className="card">
            <div className="cnt">
              <video
                controls
                src={`${API_BASE_URL}${lectureData.video_url}`}
                style={{ objectFit: "cover" }}
                onEnded={() => {
                  console.log("Video watched completely");
                }}
              />

              <Typography
                className="title"
                gutterBottom
                variant="h5"
                component="div"
              >
                {lectureData.title}
              </Typography>
            </div>
          </div>
          <Button
            variant="contained"
            className={`btn ${
              lectureData.is_deleted ? "btn-inactive" : "btn-active"
            }`}
            onClick={() => lectureCourse(lectureData._id)}
          >
            {lectureData.is_deleted ? "Activate" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
