"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { ADMIN_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

import  "./singleCourse.css"
import Navbar from "@/components/navbar/Navbar";

import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

import Confirm from "@/components/confirmDelete/Confirm";
import EditCourse from "@/components/edit/EditCourse";

const page = () => {
  const [loading, setLoading] = useState(true); //this is used to loading time show the loading pera

  const { id } = useParams();
  const {
    token,

  } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [selectCourse, setSelectCourse] = useState(null);
  const [openEdit, setopenEdit] = useState(false);

  // ---------------single course-------------------------
  useEffect(() => {
    if (!token) {
      return;
    } else {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${ADMIN_API.SINGLE_COURSE}?courseId=${id}`,
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



  return (
    <div>
      <Navbar />
      <div className="single-course">
        <div className="single-course-sct1-cnt1">
          <Button
            className="btn-go-back"
            onClick={() => {
              router.back();
            }}
          >
            ⇐ 
          </Button>

          <div key={course.id} sx={{ maxWidth: 445 }} className="card">
            <img src={`${API_BASE_URL}${course.thumbnail}`} alt="" />
           <div className="lecture-btns">

            <Button
              variant="contained"
              className="all-lecture"
              onClick={() =>
                router.push(`/admin/all-lectures/${course.id}`)
              }
            >
              view all lecture
            </Button>
           </div>
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
                Instructor:<span>{course?.instructor?.name}</span>
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
                status:{course.status}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.description}
              </Typography>
            </div>
            {/* {course?.status === "approved" && ( */}
            <CardActions
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button size="small" onClick={() => handleDeleteClick(course.id)}>
                delete
              </Button>
            </CardActions>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
