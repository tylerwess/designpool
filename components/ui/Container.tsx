import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  size = "default",
  gutter = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "medium" | "narrow";
  gutter?: "default" | "roomy";
}) {
  const width = size === "narrow" ? "max-w-3xl" : size === "medium" ? "max-w-5xl" : "max-w-6xl";
  const padding = gutter === "roomy" ? "px-7.5" : "px-5";
  return <div className={`mx-auto w-full ${padding} ${width} ${className}`.trim()}>{children}</div>;
}
