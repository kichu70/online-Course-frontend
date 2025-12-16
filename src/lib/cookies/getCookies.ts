"use server";

import { cookies } from "next/headers";

export const getCookie = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value || null;
  const rawUser = cookieStore.get("user")?.value;

  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    user = null;
  }

  return {
    token,
    user,
  };
};