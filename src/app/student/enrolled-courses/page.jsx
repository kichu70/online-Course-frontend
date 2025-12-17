"use client";
import React, { useEffect, useState } from "react";

import "./enrolledCourse.css";
import Navbar from "@/components/navbar/Navbar";

import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import axios from "axios";
import { useAuth } from "@/lib/auth.jsx";
import { useRouter } from "next/navigation";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { toast } from "react-toastify";

const page = () => {
  const [course, setCourse] = useState([]);
  const { token, onFreeEnroll, reusebleFunction } = useAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(true); //this is used to loading time show the loading pera

  // -------------fetch enrolled course's-------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${STUDENT_API.ENROLLED_COURSES}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const enrolled = res.data.data || [];
        const onlyCourses = enrolled.map((item) => ({
          ...item.course,
          enrolledId: item._id,
          price_at_purchase: item.price_at_purchase,
        }));

        setCourse(onlyCourses);
      } catch (err) {
        console.log(err, "error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //---------------Redirect if no course found-------------------------------------
  useEffect(() => {
    if (!loading && course.length === 0) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, course, router]);

  return (
    <div>
      <Navbar />
      <div className="enrolled">
        {loading ? (
          <div className="loading-course">
            <p>Loading courses...</p>
          </div>
        ) : course.length === 0 ? (
          <div className="no-enrolled-course">
            &nbsp;
            <p>No enrolled courses available .</p>
          </div>
        ) : (
          <>
            <h1 className="view-h1">"Click course to view videos"</h1>
            <div className="enrollled-sct1-cnt1">
              {course.map((course) => (
                <Card
                  sx={{ maxWidth: 445 }}
                  key={course._id}
                  className="card"
                  onClick={() =>
                    router.push(`/student/all-lectures/${course._id}`)
                  }
                >
                  <CardMedia
                    className="card-media"
                    sx={{ height: 140 }}
                    image={`${API_BASE_URL}${course.thumbnail}`}
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography
                      className="title"
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {course.title}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      Instructor:<span>{course?.instructor?.name}</span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {course.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {course.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  ></CardActions>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
