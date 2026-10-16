"use client";

import { useSyncExternalStore, type ChangeEvent } from "react";
import { THEME_STORAGE_KEY } from "@/lib/design-tokens";

/** themeInitScript sets the `dark` class before paint; the switch mirrors that class. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="2.25" fill="currentColor" />
      <path
        d="M6 .75v1.1M6 10.15v1.1M.75 6h1.1M10.15 6h1.1M2.3 2.3l.78.78M8.92 8.92l.78.78M2.3 9.7l.78-.78M8.92 3.08l.78-.78"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M10.25 7.4A4.5 4.5 0 0 1 4.6 1.75a4.5 4.5 0 1 0 5.65 5.65Z" fill="currentColor" />
    </svg>
  );
}

/** Flat on/off switch: gray track for light, accent track for dark, white knob with a sun or moon. */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage blocked: the theme still switches for this visit.
    }
  }

  return (
    <label className="theme-switch">
      <input type="checkbox" role="switch" aria-label="Dark mode" checked={dark} onChange={onChange} className="sr-only" />
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-knob">{dark ? <MoonIcon /> : <SunIcon />}</span>
      </span>
    </label>
  );
}
