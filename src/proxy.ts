import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const studentRoutes = [
      "/dashboard",
      "/profile",
      "/matches",
      "/applications",
      "/eligibility",
      "/costing",
    ];
    if (
      studentRoutes.some((route) => path.startsWith(route)) &&
      token?.role === "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/matches/:path*",
    "/applications/:path*",
    "/eligibility/:path*",
    "/costing/:path*",
    "/admin/:path*",
  ],
};
