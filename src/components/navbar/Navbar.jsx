"use client";

import React, { useState } from "react";
import "./navbar.css";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideBar from "../sidebar/SideBar";
import EduclassLogo from "../../../public/logoEduclass.png";
import Image from "next/image";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
const Navbar = () => {
  const router = useRouter();
  const { logout, token, user } = useAuth();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    // Navigate to all-course page with query param
    router.push(`/student/course-category?category=${selectedCategory}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // toggle the sidebar visibility
  };
  
  return (
    <div className="navbar">
      {user?.role === "student" || !token ? (
        <div className="navbar-cnt1">
          <div className="nav-cnt1">
            <Link href={"/"}>
              <Image
                className="logo"
                src={EduclassLogo}
                alt="EduClass"
                height={80}
              />
            </Link>
          </div>
          <div className="nav-cnt2">
            <input
              className="search"
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/student/all-courses?search=${search}`);
                }
              }}
            />
            <button
              className="all-course"
              onClick={() => router.push("/student/all-courses")}
            >
              all course
            </button>
          </div>
          <div className="nav-cnt3">
            {user ? (
              <>
                {/* <button onClick={logout}>logout</button> */}
                <ShoppingCartIcon className="cart-btn" onClick={() => router.push("/student/cart")}/>
                <MenuOutlinedIcon  className="" onClick={toggleSidebar}/>
              </>
            ) : (
              <>
                <Link href={"/login"}>
                  <button>login</button>
                </Link>
                <Link href={"/register"}>
                  <button>sign in</button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : // ------------------instructor nav------------------

      user?.role === "instructor" ? (
        <div className="navbar-cnt1">
          <div className="nav-cnt1">
            <Link href={"/instructor"}>
              <Image
                className="logo"
                src={EduclassLogo}
                alt="EduClass"
                height={80}
              />
            </Link>
          </div>
          <div className="nav-cnt2"></div>
          <div className="nav-cnt3">
            {token ? (
              <>
                <button onClick={() => router.push("/instructor/add-course")}>
                  add course
                </button>
                <button onClick={logout}>logout</button>
                <button className="mbl" onClick={toggleSidebar}>
                  ≡
                </button>
              </>
            ) : (
              <>
                <Link href={"/login"}>
                  <button>login</button>
                </Link>
                <Link href={"/register"}>
                  <button>sign in</button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : // ---------------admin nav---------------------------

      user?.role === "admin" ? (
        <div>aa</div>
      ) : (
        <></>
      )}
      <SideBar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
    </div>
  );
};

export default Navbar;
