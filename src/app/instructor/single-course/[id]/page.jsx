"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

import "./singleCourseInstructor.css";
import Navbar from "@/components/navbar/Navbar";

import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

import Confirm from "@/components/confirmDelete/Confirm";
import { toast } from "react-toastify";

const page = () => {
  const [course, setCourse] = useState([]);

  const { id } = useParams();
  const {
    token,
    onFreeEnroll,
    reusebleFunction,
    enrolledCourses,
    setEnrolledCourses,
  } = useAuth();

  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(true); //this is used to loading time show the loading pera

  // ---------------single course-------------------------
  useEffect(() => {
    if (!token) {
      return;
    } else {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${INSTRUCTOR_API.SINGLE_COURSE}?courseId=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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

  // ------------delete course --------------------
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const onhandledelete = (id) => {
    if (!deleteId) return;
    try {
      const dltdata = async () => {
        const res = await axios.put(
          `${INSTRUCTOR_API.DELETE_COURSE}?id=${deleteId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data, "deleted");
        toast.success("book have been deleted");
        router.push("/instructor");
      };
      dltdata();
    } catch (err) {
      console.log(err, "error is in the delete function");
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="single-course">
        <div className="single-course-sct1-cnt1">
          <div
            key={course.id}
            sx={{ maxWidth: 445 }}
            className="card"
            onClick={() => router.push(`/instructor/all-lectures/${course.id}`)}
          >
            <img src={`${API_BASE_URL}${course.thumbnail}`} alt="" />
            <Button variant="contained">view all lecture</Button>
            <br />
            &nbsp;
            <Rating
              name="course-rating"
              value={course.average_rating}
              precision={0.5}
              readOnly
            />
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
                ₹ {course.price}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.category}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.description}
              </Typography>
            </div>
            <CardActions>
              <Button>edit</Button>
              <Button size="small" onClick={() => handleDeleteClick(course.id)}>
                delete
              </Button>
            </CardActions>
          </div>
        </div>
      </div>

      <Confirm
        open={openConfirm}
        onConfirm={onhandledelete}
        onCancel={() => {
          setOpenConfirm(false);
          toast.dark("course not deleted");
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default page;
