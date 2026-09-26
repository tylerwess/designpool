import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 font-display text-sm text-bg hover:opacity-90",
  secondary:
    "inline-flex h-11 items-center justify-center rounded-full border border-ink px-6 font-display text-sm text-ink hover:bg-ink hover:text-bg",
  ghost:
    "inline-flex items-center font-display text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink",
} as const;

function LaunchIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path
        d="M3 9 9 3M5 3h4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

type Variant = keyof typeof variants;

type Shared = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkButton = Shared & { href: string; external?: boolean };
type NativeButton = Shared & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkButton | NativeButton) {
  const variant = props.variant ?? "primary";
  const className = `${variants[variant]} ${props.className ?? ""}`.trim();

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a href={props.href} className={`${className} gap-1.5`} target="_blank" rel="noopener noreferrer">
          {props.children}
          <LaunchIcon />
        </a>
      );
    }
    return (
      <Link href={props.href} className={className}>
        {props.children}
      </Link>
    );
  }

  const native = props as NativeButton;
  const { type = "button", ...rest } = native;
  delete rest.variant;
  delete rest.className;
  delete rest.children;
  return (
    <button type={type} className={className} {...rest}>
      {native.children}
    </button>
  );
}
