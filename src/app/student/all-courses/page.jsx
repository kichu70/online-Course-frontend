"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/navbar/Navbar";
import "./all-course.css";

import { STUDENT_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import { useAuth } from "@/lib/auth";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { handlePayment } from "@/components/payment/paymentButton";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const [course, setCourse] = useState([]);
  const router = useRouter();

  const {
    token,
    onFreeEnroll,
    reusebleFunction,
    enrolledCourses,
    addToCart,
    user,
    isInCart,
  } = useAuth();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  // SEARCH FILTER (SAFE)
  const filteredCourses = search
    ? course.filter((c) =>
        `${c.title} ${c.category} ${c.description} ${c.instructor_name} ${c.price}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : course;

  // -------- FETCH COURSES ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${STUDENT_API.ALL_COURSE}?page=${page}&limit=8`
        );
        const idReplace = res.data.data.map(({ _id, ...rest }) => ({
          id: _id,
          ...rest,
        }));
        setCourse(idReplace);
        setTotalPage(res.data.totalPage);
      } catch (err) {
        setNetworkError(true);
        console.log(err, "error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="all-course">
      <Navbar />

      {loading ? (
        <div className="loading-course">
          <p>Loading courses...</p>
        </div>
      ) : networkError ? (
        <div className="network-error">
          <p>⚠ Network Error. Please try again.</p>
        </div>
      ) : (
        <div className="all-crs-cnt1">
          {filteredCourses.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No courses found
            </p>
          ) : (
            filteredCourses.map((course) => (
              <Card sx={{ maxWidth: 445 }} key={course.id} className="card">
                <CardMedia
                  className="card-media"
                  sx={{ height: 140 }}
                  image={`${API_BASE_URL}${course.thumbnail}`}
                  title={course.title}
                />

                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {course.title}
                  </Typography>

                  <Typography gutterBottom variant="h6">
                    Instructor: <span>{course.instructor_name}</span>
                  </Typography>

                  <Typography gutterBottom variant="h6">
                    {enrolledCourses.includes(course.id)
                      ? `₹ ${course.price}`
                      : course.price > 0
                      ? `₹ ${course.price}`
                      : "Free"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {course.category}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                </CardContent>

                <CardActions onClick={(e) => e.stopPropagation()}>
                  {token &&
                  user?.role === "student" &&
                  enrolledCourses?.includes(course.id) ? (
                    <Button
                      size="small"
                      onClick={() =>
                        router.push(`/student/all-lectures/${course.id}`)
                      }
                    >
                      Play
                    </Button>
                  ) : course.price > 0 ? (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() =>
                          handlePayment(course.id, token)
                        );
                      }}
                    >
                      Buy Now
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() =>
                          onFreeEnroll(course.id)
                        );
                      }}
                    >
                      Enroll
                    </Button>
                  )}

                  <Button
                  disabled={isInCart(course.id)}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      reusebleFunction(() => addToCart(course));
                    }}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </div>
      )}

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
  );
};

export default page;
