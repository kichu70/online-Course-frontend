"use server";

import { cookies } from "next/headers";

export const setCookie = async (token: string, userData: any) => {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("user", JSON.stringify(userData), {
    httpOnly: false, // allow reading on client
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}