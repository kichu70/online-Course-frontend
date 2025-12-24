"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";
import axios from "axios";
import Navbar from "@/components/navbar/Navbar"
import "./enrolledCourse.css"

const page = () => {
      const [enrolledStudents, setEnrolledStudents] = useState([]);
      const router = useRouter();
      const { token, user } = useAuth();
    




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
          setEnrolledStudents(idReplace);
        } catch (err) {
          console.log(err, "error is inside the fetch enrolled student");
        }
      };
      fetchEnroll();
    } catch (err) {
      console.log(err, "error is in the fr fetch enrolled student ");
    }
  }, [token, user]);
  return (
    <div><Navbar/>
      <div className="inst-hom-sct2-cnt1">
        <div className="enrolled-student-list2">
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
                    {index + 1}) <span>{enr.student.name} </span>
                  </td>
                  <td className="table-cell">{enr.course.title}</td>
                  <td className="table-cell">
                    <span className="price">₹ {enr.price_at_purchase}</span>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
