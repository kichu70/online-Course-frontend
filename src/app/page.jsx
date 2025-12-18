"use client";
import SideBar from "@/components/sidebar/SideBar";
import Navbar from "@/components/navbar/Navbar";
import "./style/home.css";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import GradientText from "@/components/ui/GradientText";

import baloonChair from "../../public/homeImg/chair1.png";
import laugh from "../../public/homeImg/laugh.png";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import { API_BASE_URL, STUDENT_API } from "@/lib/constants/apiUrl";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { toast } from "react-toastify";
import { handlePayment } from "@/components/payment/paymentButton";
import Rating from "@mui/material/Rating";

export default function Home() {
  const {
    token,
    addToCart,
    user,
    reusebleFunction,
    onFreeEnroll,
    enrolledCourses,
    setEnrolledCourses,
    isInCart
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const [BCAcourse, setBCACourse] = useState([]);
  const [freeCourse, setFreeCourse] = useState([]);
  const [paidCourse, setPaidCourse] = useState([]);

  const [loading, setLoading] = useState(true); //this is used to loading time show the loading pera
  const [networkError, setNetworkError] = useState(false); //this is used to  show the network error pera

// useEffect(() => {
//   if (!token || !user) return;

//   if (user.role === "admin") {
//     router.replace("/admin");
//     return;
//   }

//   if (user.role === "instructor") {
//     router.replace("/instructor");
//     return;
//   }
// }, [token, user]);


  // Check if we came from /success page----------to reload-----------------------
  useEffect(() => {
    const fromSuccess = document.referrer.includes("/success");
    if (fromSuccess) {
      console.log("Reloading Home because  came from Success page");
      window.location.reload();
    }
  }, [pathname]);

  // ----------------fetch courses----------------------
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const [bcaRes, freeRes, paidRes] = await Promise.all([
          axios.get(`${STUDENT_API.ANY_COURSE}?category=BCA`),
          axios.get(`${STUDENT_API.ANY_COURSE}?price=0`),
          axios.get(`${STUDENT_API.ANY_COURSE}`),
        ]);

        setBCACourse(
          bcaRes.data.data.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
        );

        setFreeCourse(
          freeRes.data.data
            .map(({ _id, ...rest }) => ({ id: _id, ...rest }))
            .slice(0, 4)
        );

        setPaidCourse(
          paidRes.data.data
            .map(({ _id, ...rest }) => ({ id: _id, ...rest }))
            .filter((c) => c.price > 0)
            .slice(0, 4)
        );
      } catch (err) {
        console.error("Error fetching courses:", err);
        setNetworkError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // used for the button if the user and role is student-----------------

  const studentOnlyRoute = (callback) => {
    if (!token) {
      toast.info("Please login to continue");
      router.push("/login");
      return;
    }

    if (user?.role !== "student") {
      toast.error("Only students can access this");
      return;
    }

    callback();
  };



  // *******************************************************
  return (
    <div>
      <div className="home"></div>
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
        <div className="main-div">
          <div className="home-sct1">
            <div className="sct1-cnt1">
              <h1>Empower Your Future</h1>
              <h3>
                Shape your future with flexible online BCA, B.Com, and BA
                degrees designed for career-ready skills and learning on your
                schedule.
              </h3>
              <h3 className="sct1-pera2">
                Study BCA, B.Com, or BA online and gain industry-ready skills
                for a successful future.
              </h3>
              <div className="view-course-btn">
                <Link href={"/student/all-courses"}>
                  <Button variant="contained">view course</Button>
                </Link>
              </div>
            </div>
            <div className="sct1-cnt2">
              <Image
                src={baloonChair}
                id="baloonChair"
                className="imgShadow"
                alt=""
                priority
              />
            </div>
          </div>
          {/* -----------------section 2--------------------------------------- */}

          <div className="home-sct2">
            <div className="sct2-cnt1">
              <div className="sct2-cnt1-card">
                <Card
                  sx={{ maxWidth: 445 }}
                  className="card"
                  onClick={() =>
                    studentOnlyRoute(() =>
                      router.push(`/student/single-course/${BCAcourse[0]?.id}`)
                    )
                  }
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={`${API_BASE_URL}${BCAcourse[0]?.thumbnail}`}
                    title="green iguana"
                  />
                  <br />
                  &nbsp;{" "}
                  <Rating
                    name="course-rating"
                    value={BCAcourse[0]?.average_rating ?? 0}
                    precision={0.5}
                    readOnly
                  />
                  <CardContent>
                    <Typography
                      className="title"
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {BCAcourse[0]?.title}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h6"
                      className=""
                      component="div"
                    >
                      total lectures : {BCAcourse[0]?.total_lectures}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      Instructor:<span>{BCAcourse[0]?.instructor_name}</span>
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="price"
                    >
                      ₹ {BCAcourse[0]?.price > 0 ? BCAcourse[0].price : "Free"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {BCAcourse[0]?.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {BCAcourse[0]?.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {token &&
                    user?.role === "student" &&
                    enrolledCourses?.includes(BCAcourse[0]?.id) ? (
                      <Button
                        size="small"
                        onClick={() =>
                          router.push(
                            `/student/all-lectures/${BCAcourse[0]?.id}`
                          )
                        }
                      >
                        play
                      </Button>
                    ) : BCAcourse[0]?.price > 0 ? (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          reusebleFunction(() =>
                            handlePayment([BCAcourse[0]?.id], token)
                          );
                        }}
                      >
                        buy now
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          reusebleFunction(() =>
                            onFreeEnroll(BCAcourse[0]?.id)
                          );
                          setEnrolledCourses((prev) => [
                            ...prev,
                            BCAcourse[0]?.id,
                          ]);
                        }}
                      >
                        enroll
                      </Button>
                    )}
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        reusebleFunction(() => addToCart(BCAcourse[0]));
                      }}
                    >
                      add to cart
                    </Button>
                  </CardActions>
                </Card>
              </div>
              <div className="sct2-cnt1-pera">
                <GradientText
                  colors={[
                    "#1e1b1bff",
                    "#dadadaff",
                    "#232323ff",
                    "#ffffffff",
                    "#645728ff",
                    "#2a2929ff",
                  ]}
                  animationSpeed={8}
                  showBorder={false}
                  className="custom-class"
                >
                  "Join the BCA course today and turn your passion for computers
                  into a thriving career!"
                </GradientText>
              </div>
            </div>
            <div className="sct2-bg">
              <div className="sct2-cnt2">
                <h1>free courses</h1>
                <div className="card2">
                  {freeCourse.map((course) => {
                    const isEnrolled =
                      token &&
                      user?.role === "student" &&
                      enrolledCourses?.includes(course.id);
                    return (
                      <Card
                        key={course.id}
                        sx={{ maxWidth: 445 }}
                        className="card"
                        onClick={() =>
                          studentOnlyRoute(() =>
                            router.push(`/student/single-course/${course.id}`)
                          )
                        }
                      >
                        <CardMedia
                          onClick={() =>
                            router.push(`/student/single-course/${course.id}`)
                          }
                          className="card-media"
                          sx={{ height: 140 }}
                          image={`${API_BASE_URL}${course.thumbnail}`}
                          title="green iguana"
                        />
                        <br />
                        &nbsp;
                        <Rating
                          name="course-rating"
                          value={course.average_rating}
                          precision={0.5}
                          readOnly
                        />
                        <CardContent>
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
                        >
                          {isEnrolled ? (
                            <Button
                              size="small"
                              onClick={() =>
                                router.push(
                                  `/student/all-lectures/${course.id}`
                                )
                              }
                            >
                              play
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
                              buy now
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              onClick={() => {
                                reusebleFunction(() =>
                                  onFreeEnroll(course?.id)
                                );
                                setEnrolledCourses((prev) => [
                                  ...prev,
                                  course.id,
                                ]);
                              }}
                            >
                              enroll
                            </Button>
                          )}
                          <Button
                            size="small"
                            disabled={isInCart(course.id)}
                            sx={{
                              textDecoration: isInCart(course.id)
                                ? "line-through"
                                : "none",
                              opacity: isInCart(course.id) ? 0.5 : 1,
                              cursor: isInCart(course.id)
                                ? "not-allowed"
                                : "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              reusebleFunction(() => addToCart(course));
                            }}
                          >
                            add to cart
                          </Button>
                        </CardActions>
                      </Card>
                    );
                  })}
                </div>

                <Button
                  className="free-btn"
                  onClick={() => router.push("/student/all-courses")}
                  variant="contained"
                >
                  view all free courses
                </Button>
              </div>
            </div>
          </div>

          {/*-----------------section 3-------------------------------------------------  */}
          <div className="home-sct3">
            <div className="sct3-cnt1">
              <div className="sct3-cnt1-card">
                <Image src={laugh} id="laugh" alt="" />
              </div>
              <div className="sct3-cnt1-card-pera">
                <GradientText
                  colors={[
                    "#585814ff",
                    "#454411ff",
                    "#d9e97fff",
                    "#454411ff",
                    "#ccbd19ff",
                    "#645728ff",
                  ]}
                  animationSpeed={8}
                  showBorder={false}
                  className="custom-class"
                >
                  "Invest in your mind today — your future self will thank you."
                </GradientText>
                <Button variant="contained">Buy now</Button>
              </div>
            </div>
            <div className="cnt3-bg">
              <div className="sct3-cnt2">
                <div className="sct3-card">
                  <h1>paid courses</h1>
                  <div className="card2">
                    {paidCourse.map((course) => (
                      <Card
                        key={course.id}
                        sx={{ maxWidth: 445 }}
                        className="card"
                        onClick={() =>
                          studentOnlyRoute(() =>
                            router.push(`/student/single-course/${course.id}`)
                          )
                        }
                      >
                        <CardMedia
                          className="card-media"
                          sx={{ height: 140 }}
                          image={`${API_BASE_URL}${course.thumbnail}`}
                          title="green iguana"
                        />
                        <br />
                        &nbsp;
                        <Rating
                          name="course-rating"
                          value={course.average_rating}
                          precision={0.5}
                          readOnly
                        />
                        <CardContent>
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
                              `₹ ${course.price}`
                            ) : (
                              "Free"
                            )}
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
                        >
                          {token &&
                          user?.role === "student" &&
                          enrolledCourses?.includes(course.id) ? (
                            <Button
                              size="small"
                              onClick={() =>
                                router.push(
                                  `/student/all-lectures/${course.id}`
                                )
                              }
                            >
                              play
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
                                console.log("Clicked Course =", course?.id);
                                reusebleFunction(() =>
                                  onFreeEnroll(course?.id)
                                );
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
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
