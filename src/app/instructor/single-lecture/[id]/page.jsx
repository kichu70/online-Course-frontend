"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import "./singleLecture.css";
import { INSTRUCTOR_API, API_BASE_URL } from "@/lib/constants/apiUrl";

import Navbar from "@/components/navbar/Navbar";
import EditLecture from "@/components/edit/EditLecture";
import Confirm from "@/components/confirmDelete/Confirm";
import { toast } from "react-toastify";

const page = () => {
  const params = useParams();
  const { token, role } = useAuth();

  const [lectureData, setLectureData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [selectLecture, setSelectLecture] = useState(null);
  const [openEdit, setopenEdit] = useState(false);

  const lectureId = params?.id;
  const router = useRouter();
  

  // -----------fetch lecture data -----------------
  useEffect(() => {
    // console.log(token)
    try {
      if (!token) {
        return console.log("no token");
      } else {
        if (!lectureId) {
          return console.log("no lectureId");
        } else {
          const fetchdata = async () => {
            try {
              const res = await axios.get(
                `${INSTRUCTOR_API.SINGLE_LECTURE}?lectureId=${lectureId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const result = res.data.data;
              console.log(result);

              setLectureData(result);
            } catch (err) {
              console.log(err, "error is in the fetch data fr");
            }
          };
          fetchdata();
        }
      }
    } catch (err) {
      console.log(err, "error is in the fr lecture fetching");
    }
  }, [token, lectureId]);

  // -----------update lecture------------------------

  const handleUpdate = (id, lecture) => {
    setEditId(id);
    setSelectLecture(lecture);
    setopenEdit(true);
  };

  // ------------delete lecture --------------------
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const onhandledelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.put(
        `${INSTRUCTOR_API.DELETE_LECTURE}?lectureId=${deleteId}&courseId=${lectureData.course}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data, "deleted");
      toast.success("lecture have been deleted");
      router.back();
    } catch (err) {
      console.log(err, "error is in the delete function");
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="lecture">
        <div className="lctr-sct1-cnt1">
          <div key={lectureData._id} sx={{ maxWidth: 445 }} className="card">
            <div className="cnt">
              <video
                controls
                src={`${API_BASE_URL}${lectureData.video_url}`}
                style={{ objectFit: "cover" }}
                onEnded={() => {
                  console.log("Video watched completely");
                }}
              />

              <Typography
                className="title"
                gutterBottom
                variant="h5"
                component="div"
              >
                {lectureData.title}
              </Typography>
            </div>
          </div>
          <Button onClick={() => handleUpdate(lectureData._id, lectureData)}>
            edit
          </Button>
          <Button
            size="small"
            onClick={() => handleDeleteClick(lectureData._id)}
          >
            delete
          </Button>
        </div>
      </div>
      <Confirm
        open={openConfirm}
        onConfirm={onhandledelete}
        onCancel={() => {
          setOpenConfirm(false);
          toast.dark("course not deleted");
          setDeleteId(null);
        }}
      />
      {openEdit && (
        <EditLecture
          open={openEdit}
          lecture={selectLecture}
          id={editId}
          onClose={(updateLecture) => {
            setopenEdit(false);
            if (updateLecture) {
              setLectureData(updateLecture);
            }
          }}
        />
      )}
    </div>
  );
};

export default page;
