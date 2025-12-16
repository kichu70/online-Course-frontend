"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import { INSTRUCTOR_API } from "@/lib/constants/apiUrl";
import "./earnigs.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const EarningsChart = () => {
  const { token } = useAuth();
  const [earningsData, setEarningsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${INSTRUCTOR_API.EARNINGS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEarningsData(res.data.courses || []);
        setTotalEarnings(res.data.totalEarnings || 0);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [token]);

  if (isLoading) {
    return <p className="earnings-loading">Loading...</p>;
  }

  if (earningsData.length === 0) {
    return <p className="earnings-empty">No earnings data found.</p>;
  }

  return (
    <div className="earnings-container">
      <h2 className="earnings-title">Total Earnings:<span> ₹{totalEarnings}</span></h2>

      <ResponsiveContainer className="earnings-chart">
        <BarChart
          data={earningsData.map((item,index) => ({
            ...item,
            label: `${index + 1}) ${item.title}`,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />

          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const data = payload[0].payload;

              return (
                <div className="earnings-tooltip">
                  <p>
                    <strong>{data.title}</strong>
                  </p>
                  <p>Price: ₹{data.price}</p>
                  <p>Earnings: ₹{data.earnings}</p>
                  <p>Enrolled: {data.enrolledStudents}</p>
                </div>
              );
            }}
          />

          <Bar dataKey="earnings" fill="#3aafa9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
