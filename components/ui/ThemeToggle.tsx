"use client";

import { useLayoutEffect, useRef } from "react";
import { THEME_STORAGE_KEY } from "@/lib/design-tokens";

function preferredDark(): boolean {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function applyTheme(next: boolean, button: HTMLButtonElement | null) {
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.style.colorScheme = next ? "dark" : "light";
  button?.setAttribute("aria-pressed", next ? "true" : "false");
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    applyTheme(preferredDark(), buttonRef.current);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    applyTheme(next, buttonRef.current);
    localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-toggle inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm text-ink"
      onClick={toggle}
      aria-pressed="false"
      aria-label="Toggle color theme"
    >
      <span className="when-light">Light</span>
      <span className="when-dark">Dark</span>
    </button>
  );
}
