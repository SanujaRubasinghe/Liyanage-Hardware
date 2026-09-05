// Components/ScrollToTop.js
'use client';
import { useEffect } from "react";
import { useLocation } from "../router-compat";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // small fallback in case async content shifts layout
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 150);

    return () => clearTimeout(timer);
    }, [pathname]);

  return null;
}
