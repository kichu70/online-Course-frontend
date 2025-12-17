"use client"
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import Navbar from "@/components/navbar/Navbar"
import { handlePayment } from "@/components/payment/paymentButton";
import "./all-lecture.css"

const Page = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError]=useState(false)

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
        const res = await axios.get(`${STUDENT_API.VIEW_LECTURE}?courseId=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res?.data?.lecture || [];
        setLectures(data);
        console.log(data)
      } catch (err) {
        console.log("Error fetching lectures:", err);
        setLectures([]);
        if(err.response && err.response.status === 404){
          setError(true)
        }
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);


 //---------------Redirect if no course found-------------------------------------
  useEffect(() => {
    if (!loading && lectures.length === 0) {
      const timer = setTimeout(() => {
        router.back();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, lectures, router]);




  if (loading) return <p className="loading-course" style={{ padding: 20 }}>Loading lectures…</p>;
  if(error)return <p className="loading-course" style={{ padding: 20 }}>not purchased</p>;
  if (!lectures.length) return <p className="loading-course" style={{ padding: 20 }}>No lectures found for this course.</p>;
  return (
    <div className="all-lectures">
      <Navbar/>
    <div className="All-lectuers-sct1-cnt1">
      {lectures.map((lec, index) => {
        const handleMouseEnter = () => {
          videoRefs.current[index]?.play();//if the videoRef contain the same ntex as hove is plays
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
              router.push(`/student/single-lectures/${lec._id}?lectureId=${lec._id}`)
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
               {index+1} ) {lec.title}
              </Typography>
              <Typography gutterBottom variant="body2" color="text.secondary">
                Instructor: {lec.instructor_name || lec.instructor || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created at: {new Date(lec.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                {lec.description || "No description available."}
              </Typography>
            </CardContent>
          </Card>
          </div>
        );
      })}
    </div>

    </div>
  );
};

export default Page;
