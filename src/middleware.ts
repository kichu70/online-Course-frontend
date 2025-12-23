import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = req.cookies.get("user")?.value;
  const url = req.nextUrl.pathname;

  // ---------- PUBLIC ROUTES ----------
  const publicRoutes = ["/login","/forget-password","/reset-password","/verify-otp", "/register","/","/success"];

  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  // ---------- NO TOKEN ----------
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let role;

    try {
    const userData =user?JSON.parse(user):null;
    role =userData?.role;

    if(!role){
        throw new Error("No Role Found")
    }

} catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ---------- ROLE MISSING ----------
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ---------- ROOT ROUTE CONTROL ----------
  if (url === "/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (role === "instructor") {
      return NextResponse.redirect(new URL("/instructor", req.url));
    }

    // student stays on /
    return NextResponse.next();
  }

  // ---------- STUDENT ROUTES ----------
  if (url.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }
  // ---------- ADMIN ROUTES ----------
  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  // ---------- INSTRUCTOR ROUTES ----------
  if (url.startsWith("/instructor") && role !== "instructor") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static|assets|homeImg).*)"],
};