"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import axios from "axios";

import Navbar from "@/components/navbar/Navbar";

import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import Typography from "@mui/material/Typography";
import "./singleLecture.css";
import Button from "@mui/material/Button";
const page = () => {
  const params = useParams();
  const { token, role } = useAuth();
  const [lectureData, setLectureData] = useState([]);
  const [completedSent, setCompletedSent] = useState(false);

  const lectureId = params?.id;

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
                `${STUDENT_API.SINGLE_LECTURE}?lectureId=${lectureId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const result = res.data.data;
              // console.log(result);

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
  }, [token, lectureId]);

  // ----------------const completede--------------

  const completWatching = async () => {
    try {
      if (!token) {
        return console.log("no token found");
      } else {
        const res = await axios.post(
          `${STUDENT_API.COMPLETED_LECTURE}`,
          {
            courseId: lectureData.course,
            lectureId: lectureData._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(res.data)
      }
    } catch (err) {
      console.log(err, "error is in the viedo completed !!");
    }
  };

  // only completed after the watch atlist 80 %-----------

  const handleProgress = (e) => {
    const video = e.target;

    const watched = video.currentTime;
    const total = video.duration;

    if (!total) return;

    const percentage = (watched / total) * 100;

    // When watched > 80% and API not sent yet
    if (percentage >= 80 && !completedSent) {
      completWatching();
      setCompletedSent(true);
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
                onTimeUpdate={(e) => handleProgress(e)}
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
          <Button>edit</Button>
          <Button>delete</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
