"use server";

import { cookies } from "next/headers";

export const clearCookie = async () => {
  const cookieStore = await cookies();

  // Loop through all cookies and delete each one
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
};