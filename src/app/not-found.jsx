"use client"
import Link from "next/link";
import "./globals.css"
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
export default function NotFound() {
    const router =useRouter()
  return (
    <div className="container">
      <h1 className="title">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Button variant="contained" onClick={()=>router.back()}>go back</Button>
    </div>
  );
}
