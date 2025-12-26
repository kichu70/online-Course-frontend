"use client";
import React, { useEffect, useState } from "react";
import "./cart.css";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";

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
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const {
    token,
    user,
    reusebleFunction,
    onFreeEnroll,
    enrolledCourses,
    cartItems,
    removeFromCart,
  } = useAuth();
  const [cart, setcart] = useState([]);
  const [selectedCourse, setSeletedCourse] = useState([]);
  const [total, setTotal] = useState(0);
    const router = useRouter();
  

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setcart("no iteam in the cart ");
    }
  }, [cartItems]);

useEffect(() => {
  if (cartItems && cartItems.length > 0) {
    setSeletedCourse(
      cartItems
        .filter((item) => !enrolledCourses?.includes(item.id))
        .map((item) => item.id)
    );
  }
}, [cartItems, enrolledCourses]);

  useEffect(() => {
const totalPrice = cartItems
  .filter(
    (item) => selectedCourse.includes(item.id) && !enrolledCourses?.includes(item.id)
  )
  .reduce((sum, item) => sum + (item.price || 0), 0);
setTotal(totalPrice);
  }, [selectedCourse, cartItems]);

  console.log(cartItems);
  return (
    <div>
      <Navbar />
      <div className="cart">
        <div className="cart-sct1-cnt1">
          {cartItems.map((course, index) => (
            <div key={index} className="cart-lists">
              <div className="list1">
                <img
                  src={`${API_BASE_URL}${course.thumbnail}`}
                  alt={course.title}
                  width={300}
                  height={180}
                  className="card-media"
                />
              </div>
              <div className="list2">
                <h1>{course.title}</h1>
                <h3>total lectures: {course.total_lectures}</h3>
                <h3>{course.category}</h3>
                <h3 className="decription">{course.description}</h3>
              </div>
              <div className="list3">
                <h1 className="price">₹{course.price}</h1>
                <input
                  type="checkbox"
                  disabled={enrolledCourses?.includes(course.id)}
                  checked={selectedCourse.includes(course.id)}
                  onChange={() => {
                    setSeletedCourse((prev) =>
                      prev.includes(course.id)
                        ? prev.filter((id) => id !== course.id)
                        : [...prev, course.id]
                    );
                  }}
                />

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(course.id)}
                >
                  Remove
                </button>
                {token &&
                user?.role === "student" &&
                enrolledCourses?.includes(course.id) ? (
                  <Button
                    variant="contained"
                    size="small"
                    className="play-btn"
                    onClick={() =>
                      router.push(`/student/all-lectures/${course.id}`)
                    }
                  >
                    play
                  </Button>
                ) : course.price > 0 ? (
                  <Button
                    size="small"
                    className="price-btn"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      reusebleFunction(() => handlePayment(course.id, token));
                    }}
                  >
                    Buy Now
                  </Button>
                ) : (
                  <Button
                    size="small"
                    className="enroll-btn"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      reusebleFunction(() => onFreeEnroll(course?.id));
                    }}
                  >
                    enroll
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="cart-sct1-cnt2">
          <div className="total-btn">
            <h1>Total Price: ₹{total}</h1>
            <Button variant="contained" className="price-btn">
              buy all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
