"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import EarningsChart from "@/components/earningChart/EarningsChart";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import "./instructorHome.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import Link from "next/link";

const page = () => {
  const [course, setCourse] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const { token, user } = useAuth();
  const router = useRouter();

  // ---------------------fetch course------------------

  useEffect(() => {
    try {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`${INSTRUCTOR_API.TOP_RATED}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data.data);
          const idReplace = res.data.data.map(({ _id, ...rest }) => ({
            id: _id,
            ...rest,
          }));
          setCourse(idReplace.slice(0, 4));
        } catch (err) {
          console.log(err, "error is in the fr fetchdata ");
        }
      };
      fetchCourse();
    } catch (err) {
      console.log(err, "error is in the fr fetchcourse-instr");
    }
  }, [token, user]);

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

  // -----------------enrolled sutdents-------------------

  useEffect(() => {
    try {
      const fetchEnroll = async () => {
        if (!token) return;
        try {
          const res = await axios.get(`${INSTRUCTOR_API.ENROLLED_STUDENTS}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data.data);
          const idReplace = res.data.data.map(({ _id, ...rest }) => ({
            id: _id,
            ...rest,
          }));
          setEnrolledStudents(idReplace.slice(0,5));
        } catch (err) {
          console.log(err, "error is inside the fetch enrolled student");
        }
      };
      fetchEnroll();
    } catch (err) {
      console.log(err, "error is in the fr fetch enrolled student ");
    }
  }, [token, user]);

  // ********************************************************************
  return (
    <div>
      <Navbar />
      <div className="instructor-home">
        <EarningsChart />
        {/* ----------------------------sct1-------------- */}
        <h1 className="instructor-home-h1">course</h1>
        <div className="inst-hom-sct1-cnt1">
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
        <div className="inst-hom-sct1-cnt1-button">
                        <Link href={"/instructor/all-course"}>
          <Button variant="contained">view all</Button>
              </Link>
        </div>
        {/* -------------------------------------sct2-------------------------------------------------- */}
        <div className="inst-hom-sct2-cnt1">
          <div className="enrolled-student-list">
            <table className="my-table">
              <thead>
                <tr>
                  <th className="table-head">name</th>
                  <th className="table-head">course</th>
                  <th className="table-head">price at purchase</th>
                </tr>
              </thead>
              {enrolledStudents.map((enr, index) => (
                <tbody key={index}>
                  <tr>
                    <td className="table-cell">
                    {index+1}) <span>{enr.student.name} </span>
                    </td>
                    <td className="table-cell">
                      {enr.course.title}
                    </td>
                    <td className="table-cell"><span className="price">₹ {enr.price_at_purchase}</span></td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
