"use client";

import { useLayoutEffect, useRef, type ChangeEvent } from "react";
import { THEME_STORAGE_KEY } from "@/lib/design-tokens";

function preferredDark(): boolean {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function applyTheme(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.style.colorScheme = next ? "dark" : "light";
}

export function ThemeToggle() {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const dark = preferredDark();
    applyTheme(dark);
    if (inputRef.current) inputRef.current.checked = dark;
  }, []);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
  }

  return (
    <input
      ref={inputRef}
      type="checkbox"
      className="theme-checkbox"
      aria-label="Dark mode"
      onChange={onChange}
    />
  );
}
