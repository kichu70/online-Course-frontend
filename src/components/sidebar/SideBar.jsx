"use client";
import React, { useEffect, useRef, useState } from "react";
import "./sidebar.css";
import { useAuth } from "@/lib/auth";
import defult_profile from "../../../public/profile.jpg";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SideBar = ({ isOpen, onClose }) => {
  const { logout, token, user } = useAuth();
  const [category, setCategory] = useState("");
  const router = useRouter();

  const sidebarRef = useRef();

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    // Navigate to all-course page with query param
    router.push(`/student/course-category?category=${selectedCategory}`);
  };

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose(); // call parent function to close sidebar
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      {!user || user?.role === "student" ? (
        <>
          {/* Section 1 */}
          <div className="sb-sct1">
            <div className="sb-sct1-cnt1">
              <h1>Side Bar</h1>
            </div>
            <div className="sb-sct1-cnt2">
              <img
                alt="Profile"
                src={user?.profile ? user.profile : "/profile.jpg"}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h2>{user?.name ?? "Guest User"}</h2>
              <h3>{user?.email ?? "Guest User"}</h3>
            </div>
          </div>

          {/* Section 2 */}
          <div className="sb-sct2">
            <div className="sb-sct2-cnt1">
              <h1>courses</h1>
              <Link href={"/student/enrolled-courses"}>
                <button>enroled course's</button>
              </Link>
              {token && (
                <select value={category} onChange={handleCategoryChange}>
                  <option value="">Course's category</option>
                  <option value="BBA">BBA</option>
                  <option value="BA">BA</option>
                  <option value="BCA">BCA</option>
                  <option value="B-Com">B Com</option>
                </select>
              )}
            </div>
            <div className="sb-sct2-cnt2"></div>
            {/* <div className="sb-sct2-cnt3">Settings</div> */}
          </div>

          {/* Section 3 */}
          <div className="sb-sct3">
            <div className="sb-sct3-cnt1">
              {user ? (
                <h3 onClick={logout}>logout</h3>
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
        </>
      ) : // -----------------instructor side bar--------------

      user?.role === "instructor" ? (
        <>
          {/* Section 1 */}
          <div className="sb-sct1">
            <div className="sb-sct1-cnt1">
              <h1>Side Bar</h1>
            </div>
            <div className="sb-sct1-cnt2">
              <img
                alt="Profile"
                src={user?.profile ? user.profile : "/profile.jpg"}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h2>{user?.name ?? "Guest User"}</h2>
              <h3>{user?.email ?? "Guest User"}</h3>
            </div>
          </div>

          {/* Section 2 */}
          <div className="sb-sct2">
            <div className="sb-sct2-cnt1">
              <h1>courses</h1>
              <Link href={"/instructor/enrolled-courses"}>
                <button>enroled course's</button>
              </Link>

            </div>
            <div className="sb-sct2-cnt2"></div>
            {/* <div className="sb-sct2-cnt3">Settings</div> */}
          </div>

          {/* Section 3 */}
          <div className="sb-sct3">
            <div className="sb-sct3-cnt1">
              {user ? (
                <h3 onClick={logout}>logout</h3>
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
        </>
      ) : // ---------------------------admin side bar----------------------------

      user?.role === "admin" ? (
        <div></div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SideBar;
