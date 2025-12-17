"use client";
import React, { useEffect, useState } from "react";
import "./cart.css";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";

const page = () => {
  const { cartItems, removeFromCart } = useAuth();
  const [cart, setcart] = useState([]);
  const [selectedCourse, setSeletedCourse] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setcart("no iteam in the cart ");
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setSeletedCourse(cartItems.map((item) => item.id));
    }
  }, [cartItems]);
  useEffect(() => {
    const totalPrice = cartItems
      .filter((item) => selectedCourse.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    setTotal(totalPrice);
  }, [selectedCourse, cartItems]);


  console.log(cartItems);
  return (
    <div>
      <Navbar />
      <div className="cart">
        <div className="cart-sct1-cnt1">
          {/* {course.title} */}
        </div>
        <div className="cart-sct1-cnt2"></div>
      </div>
    </div>
  );
};

export default page;
