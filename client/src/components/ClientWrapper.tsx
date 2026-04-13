"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SessionProvider } from "next-auth/react";
import SessionExpiryWatcher from "./SessionExpiryWatcher";
import Clarity from "@microsoft/clarity";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "wawn0y0zoh";
  const clarityInitializedRef = useRef(false);

  useEffect(() => {
    if (!projectId || clarityInitializedRef.current) return;
    Clarity.init(projectId);
    clarityInitializedRef.current = true;
  }, [projectId]);

  useEffect(() => {
    if (!pathname) return;
    Clarity.setTag("pagePath", pathname);
  }, [pathname]);

  // Routes where we DON'T want the Navbar and Footer
  const noShellRoutes = ["/matches", "/login", "/register"];
  const hideShell = noShellRoutes.some((r) => pathname?.startsWith(r));

  if (hideShell) {
    return (
      <SessionProvider>
        <SessionExpiryWatcher />
        {children}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <SessionExpiryWatcher />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </SessionProvider>
  );
}
