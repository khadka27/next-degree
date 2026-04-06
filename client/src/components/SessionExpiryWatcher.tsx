"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/register", "/signup"];

export default function SessionExpiryWatcher() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated" || !session?.expires) {
      return;
    }

    const expiresAt = new Date(session.expires).getTime();

    if (Number.isNaN(expiresAt)) {
      return;
    }

    const redirectTo = AUTH_ROUTES.some((route) => pathname?.startsWith(route))
      ? pathname || "/login"
      : "/login?expired=1";

    const logoutNow = async () => {
      await signOut({
        redirect: true,
        callbackUrl: redirectTo,
      });
    };

    const delay = expiresAt - Date.now();

    if (delay <= 0) {
      void logoutNow();
      return;
    }

    const timer = window.setTimeout(() => {
      void logoutNow();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [pathname, session?.expires, status]);

  return null;
}
