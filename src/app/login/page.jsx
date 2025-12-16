"use client";

import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useAuth } from "../../lib/auth";
import "./login.css";
import { useRouter } from "next/navigation";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login,blockLoginForStudent,token } = useAuth();

  const [error, setError] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 8) {
      setError(true);
      return;
    } else {
      setError(false);
      login(email, password);
    }
  };

// ---------------if logined then logout out to login as user------------
    useEffect(() => {
    if (blockLoginForStudent()) {
       const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

    }
  }, [token]);
  return (
    <form action="">
      <div className="login">
        &nbsp;
        <div className="section">
          <div className="cnt1">
            <TextField
              className="text"
              label="email"
              color="secondary"
              onChange={(e) => setEmail(e.target.value)}
              // focused
              error={
                error &&
                (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              }
              helperText={
                error && !email.trim()
                  ? "Email is Requierd"
                  : error && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Invalide email formate"
                  : ""
              }
              required
            />
            <TextField
              className="text"
              label="password"
              type="password"
              color="secondary"
              onChange={(e) => setPassword(e.target.value)}
              error={error && (!password || password.length < 8)}
              helperText={
                error && !password
                  ? "Password is Requierd"
                  : error && password.length < 8
                  ? "Password must contain at least 8 charecter"
                  : ""
              }
              required
            />
            <Button type="submit" className="submit" onClick={handleLogin}>
              submit
            </Button>
            <div>
              <p>
                create account <Button href="/register">signup</Button>
              </p>
            </div>
          </div>
        </div>
        &nbsp;
      </div>
    </form>
  );
};

export default login;
