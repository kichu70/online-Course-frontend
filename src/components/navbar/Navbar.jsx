"use client";

import React, { useState } from "react";
import "./navbar.css";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideBar from "../sidebar/SideBar";
const Navbar = () => {
  const router = useRouter();
  const { logout, token, user } = useAuth();
  const [category, setCategory] = useState("");
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
      {!user || user?.role === "student" ? (
        <div className="navbar-cnt1">
          <div className="nav-cnt1">
            <Link href={"/"}>
              <button>home</button>
            </Link>
          </div>
          <div className="nav-cnt2">
            <input className="search" type="search" placeholder="Search..." />
            {token && (
              <select value={category} onChange={handleCategoryChange}>
                <option value="">Course's</option>
                <option value="BBA">BBA</option>
                <option value="BA">BA</option>
                <option value="BCA">BCA</option>
                <option value="B-Com">B Com</option>
              </select>
            )}
          </div>
          <div className="nav-cnt3">
            {token ? (
              <>
                <button onClick={logout}>logout</button>
                <button className="mbl" onClick={toggleSidebar}>≡</button>
              </>
            ) : (
              <>
                <Link href={"/login"}>
                  <button>login</button>
                </Link>
                <Link href={"/register"}>
                  <button>singn in</button>
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
                <button>home</button>
              </Link>
            </div>
            <div className="nav-cnt2">
              <input className="search" type="search" placeholder="Search..." />

            </div>
            <div className="nav-cnt3">
              {token ? (
                <>
                <button onClick={()=>router.push("/instructor/add-course")}>add course</button>
                  {/* <button onClick={logout}>logout</button> */}
                  <button className="mbl" onClick={toggleSidebar}>≡</button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <button>login</button>
                  </Link>
                  <Link href={"/register"}>
                    <button>singn in</button>
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
