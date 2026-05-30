"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;

      if (scrollable > 0) {
        setProgress(Math.min((scrollTop / scrollable) * 100, 100));
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px] bg-accent transition-[width] duration-100 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}
