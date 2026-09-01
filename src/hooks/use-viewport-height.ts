"use client";

import { useEffect } from "react";

// ios safari 컨텐츠 리사이즈 지원
export function useViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${viewport.height}px`,
      );
    };

    setHeight();
    viewport.addEventListener("resize", setHeight);

    return () => viewport.removeEventListener("resize", setHeight);
  }, []);
}
