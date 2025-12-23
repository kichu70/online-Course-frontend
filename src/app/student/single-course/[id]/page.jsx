"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

import "./singleCourse.css";
import Navbar from "@/components/navbar/Navbar";

import { handlePayment } from "@/components/payment/paymentButton";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const page = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const {
    token,
    onFreeEnroll,
    reusebleFunction,
    enrolledCourses,
    isInCart,
    addToCart,
  } = useAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(true); //this is used to loading time show the loading pera

  // ---------------single course-------------------------
  useEffect(() => {
    if (!token) {
      return;
    } else {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${STUDENT_API.SINGLE_COURSE}?id=${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { _id, ...rest } = res.data.data;
          const idReplace = { id: _id, ...rest };

          setCourse(idReplace);
          console.log(idReplace, "courses");
        } catch (err) {
          console.log(err, "error fetching courses");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token, id]);

  return (
    <div>
      <Navbar />
      <div
        className="single-course"
        onClick={() => router.push(`/student/all-lectures/${course.id}`)}
      >
        <div className="single-course-sct1-cnt1">
          <div key={course.id} sx={{ maxWidth: 445 }} className="card">
            <img src={`${API_BASE_URL}${course.thumbnail}`} alt="" />
            <Button variant="contained">view all lecture</Button>
            <div className="cnt">
              <Typography
                className="title"
                gutterBottom
                variant="h5"
                component="div"
              >
                {course.title}
              </Typography>
              <Typography
                className="title"
                gutterBottom
                variant="h5"
                component="div"
              >
                total lectures {course.total_lectures}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                Instructor:<span>{course?.instructor_name}</span>
              </Typography>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="price"
              >
                {enrolledCourses.includes(course.id) ? (
                  <h4 className="purchased">₹ {course.price} </h4>
                ) : course.price > 0 ? (
                  course.price
                ) : (
                  "Free"
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.category}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.description}
              </Typography>
            </div>
            <CardActions
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {enrolledCourses.includes(course.id) ? (
                <Button
                  size="small"
                  onClick={() =>
                    router.push(`/student/all-lectures/${course.id}`)
                  }
                >
                  play
                </Button>
              ) : course.price > 0 ? (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    reusebleFunction(() => handlePayment(course.id, token));
                  }}
                >
                  buy now
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={() => {
                    reusebleFunction(() => onFreeEnroll(course?.id));
                  }}
                >
                  enroll
                </Button>
              )}
              <Button
                size="small"
                disabled={isInCart(course.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  reusebleFunction(() => addToCart(course));
                }}
              >
                add to cart
              </Button>

            </CardActions>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
