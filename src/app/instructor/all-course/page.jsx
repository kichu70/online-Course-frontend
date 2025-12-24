"use client";
import React, { useEffect, useState } from "react";
import "./allCourse.css";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import axios from "axios";
import Navbar from "@/components/navbar/Navbar";

const page = () => {
  const [course, setCourse] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const { token, user } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const [totalPage, setTotalPage] = useState();
  // ---------------------fetch course------------------

  useEffect(() => {
    try {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`${INSTRUCTOR_API.TOP_RATED}?page=${page}&limit=9`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data.data);
          const idReplace = res.data.data.map(({ _id, ...rest }) => ({
            id: _id,
            ...rest,
          }));
          setCourse(idReplace);
          setTotalPage(res.data.totalPage);
        } catch (err) {
          console.log(err, "error is in the fr fetchdata ");
        }
      };
      fetchCourse();
    } catch (err) {
      console.log(err, "error is in the fr fetchcourse-instr");
    }
  }, [token, user,page]);




    // -------------instructorOnlyRoute------------
  
    const instructorOnlyRoute = (callback) => {
      if (!token) {
        toast.info("Please login to continue");
        router.push("/login");
        return;
      }
  
      if (user?.role !== "instructor") {
        toast.error("Only students can access this");
        return;
      }
  
      callback();
    };
  

    
  return (
    <div>
      <Navbar />
      <div className="allCourse-sct1">
        <div className="allCourse-sct1-ctn1">
          {course.map((course, index) => (
            <Card
              key={course.id}
              sx={{ maxWidth: 445 }}
              className="card"
              onClick={() =>
                instructorOnlyRoute(() =>
                  router.push(`/instructor/single-course/${course.id}`)
                )
              }
            >
              <CardMedia
                className="card-media"
                sx={{ height: 140 }}
                image={`${API_BASE_URL}${course.thumbnail}`}
                title="green iguana"
              />

              <CardContent>
                <Rating
                  name="course-rating"
                  value={course.average_rating}
                  precision={0.5}
                  readOnly
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  className="title"
                  component="div"
                >
                  {course.title}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h6"
                  className=""
                  component="div"
                >
                  total lectures : {course.total_lectures}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h6"
                  className=""
                  component="div"
                >
                  status :{course.status}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  Instructor:<span>{course?.instructor?.name}</span>
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  className="price"
                >
                  ₹{course.price}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {course.category}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {course.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      <div className="pagination0">
        <button
          className="pages0"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          {page} / {totalPage}
        </span>

        <button
          className="pages0"
          onClick={() => setPage((p) => Math.min(p + 1, totalPage))}
          disabled={page === totalPage}
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default page;
