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

/** Flat on/off switch: gray track for light, accent track for dark, plain white knob. */
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
        <span className="theme-switch-knob" />
      </span>
    </label>
  );
}
