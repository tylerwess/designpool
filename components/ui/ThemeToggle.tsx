"use client";

import { useLayoutEffect, useRef, type ChangeEvent } from "react";
import { THEME_STORAGE_KEY } from "@/lib/design-tokens";

function preferredDark(): boolean {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function CloudIcon() {
  return (
    <svg className="cloud" viewBox="0 0 64 40" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 30a11 11 0 0 1-1-21.94A14 14 0 0 1 46 12a10 10 0 0 1-2 19.9H20Z"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const dark = preferredDark();
    applyTheme(dark);
    if (inputRef.current) inputRef.current.checked = !dark;
  }, []);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const light = event.target.checked;
    applyTheme(!light);
    localStorage.setItem(THEME_STORAGE_KEY, light ? "light" : "dark");
  }

  return (
    <label className="switch">
      <input ref={inputRef} type="checkbox" aria-label="Light mode" onChange={onChange} />
      <span className="slider">
        <span className="star star_1" />
        <span className="star star_2" />
        <span className="star star_3" />
        <CloudIcon />
      </span>
    </label>
  );
}
