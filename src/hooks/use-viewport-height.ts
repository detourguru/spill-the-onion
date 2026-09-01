"use client";

import { useEffect } from "react";

// ios safari 컨텐츠 리사이즈 지원
export function useViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const setSize = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${viewport.height}px`,
      );
      document.documentElement.style.setProperty(
        "--app-offset-top",
        `${viewport.offsetTop}px`,
      );
    };

    setSize();
    viewport.addEventListener("resize", setSize);
    viewport.addEventListener("scroll", setSize);

    return () => {
      viewport.removeEventListener("resize", setSize);
      viewport.removeEventListener("scroll", setSize);
    };
  }, []);
}
