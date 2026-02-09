"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ONLY these routes require login
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      
    ];

    const isProtected = protectedRoutes.some(route =>
      pathname.startsWith(route)
    );

    if (isProtected && !token) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return children;
}
