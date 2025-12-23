"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ADMIN_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import Navbar from "@/components/navbar/Navbar";
import { handlePayment } from "@/components/payment/paymentButton";
import "./courseLectures.css";
import Button from "@mui/material/Button";

const Page = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

    const [refresh, setRefresh] = useState(false);
  

  const params = useParams();
  const courseId = params?.id;
  const router = useRouter();
  const { token } = useAuth();

  //  Store video refs in an array
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${ADMIN_API.ALL_LECTURES_OF_COURSE}?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res?.data?.data || [];
        setLectures(data);
      } catch (err) {
        console.log("Error fetching lectures:", err);
        setLectures([]);
        if (err.response && err.response.status === 404) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token,refresh]);

  //---------------Redirect if no course found-------------------------------------
  useEffect(() => {
    if (!loading && lectures.length === 0) {
      const timer = setTimeout(() => {
        router.back();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, lectures, router]);


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


  if (loading)
    return (
      <p className="loading-course" style={{ padding: 20 }}>
        Loading lectures…
      </p>
    );
  if (error)
    return (
      <p className="loading-course" style={{ padding: 20 }}>
        not lecture found
      </p>
    );
  if (!lectures.length)
    return (
      <div className="loading-course">
        <p style={{ padding: 20 }}>No lectures found for this course.</p>
        <Button variant="contained" className="btn">
          add lecture
        </Button>
        <Button
          variant="contained"
          className="btn"
          onClick={() => {
            router.back();
          }}
        >
          go back
        </Button>
      </div>
    );
  return (
    <div className="all-lectures">
      <Navbar />
      <Button
        className="btn-go-back"
        onClick={() => {
          router.back();
        }}
      >
        🔙
      </Button>
      <div className="All-lectuers-sct1-cnt1">
        {lectures.map((lec, index) => {
          const handleMouseEnter = () => {
            videoRefs.current[index]?.play(); //if the videoRef contain the same ntex as hove is plays
          };

          const handleMouseLeave = () => {
            if (videoRefs.current[index]) {
              videoRefs.current[index].pause();
              videoRefs.current[index].currentTime = 0;
            }
          };

          return (
            <div key={index} className="all-lecturs-sct1-cnt2">
              <Card
                className="all-lecture-card2"
                key={lec._id}
                // sx={{ width: 400, cursor: "pointer" }}
                onClick={() =>
                  router.push(
                    `/admin/single-lecture/${lec._id}`
                  )
                }
              >
                <video
                  className="all-lecture-video"
                  ref={(el) => (videoRefs.current[index] = el)}
                  // width="100%"
                  height="220"
                  src={`${API_BASE_URL}${lec.video_url}`}
                  muted
                  preload="metadata"
                  style={{ objectFit: "contain" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Your browser does not support the video tag.
                </video>

                <CardContent className="CardContent">
                  <Typography gutterBottom variant="h5">
                    {index + 1} ) {lec.title}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="text.secondary"
                  >
                    Instructor: {lec.instructor_name || lec.instructor || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created at: {new Date(lec.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginTop: 1 }}
                  >
                    {lec.description || "No description available."}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  className={`btn ${
                    lec.is_deleted ? "btn-inactive" : "btn-active"
                  }`}
                  onClick={(e) =>{e.stopPropagation(); lectureCourse(lec._id)}}
                >
                  {lec.is_deleted ? "Activate" : "Delete"}
                </Button>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
