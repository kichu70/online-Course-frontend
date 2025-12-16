"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import "./course-category.css";
import Navbar from "@/components/navbar/Navbar";

import { handlePayment } from "@/components/payment/paymentButton";
import { useAuth } from "@/lib/auth";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
const Page = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || null;

  const {
    token,
    onFreeEnroll,
    reusebleFunction,
    enrolledCourses,
    setEnrolledCourses,
  } = useAuth();

  // -------------fetch the course's-------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${STUDENT_API.ANY_COURSE}?category=${category}`
        );
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setCourse(idReplace);
        console.log(idReplace, "courses");
      } catch (err) {
        console.log(err, "error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

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
      {!loading && course.length > 0 && <Navbar />}
      {loading ? (
        <div className="no-course">
          <p>Loading {category} courses...</p>
        </div>
      ) : course.length === 0 ? (
        <div className="no-course">
          &nbsp;
          <p>No {category} courses available .</p>
        </div>
      ) : (
        <div className="all-course-cnt-1">
          {course.map((course) => (
            <Card sx={{ maxWidth: 445 }} key={course.id} className="card">
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
                  Instructor:<span>{course?.instructor_name}</span>
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  className="price"
                >
                  ₹ {course.price > 0 ? course.price : "Free"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {course.category}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                {course.price > 0 ? (
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
                  <Button size="small">enroll</Button>
                )}
                <Button size="small">add to cart</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
