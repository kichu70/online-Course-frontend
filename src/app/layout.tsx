import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from "../lib/auth"
import { getCookie } from "@/lib/cookies/getCookies";

export const metadata = {
  title: "EduClass",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieData = await getCookie()

  
  return (
    <html lang="en">
      <body>
        <AuthProvider cookieData={cookieData}>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
