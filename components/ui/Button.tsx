import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm text-bg hover:opacity-90",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-bg",
  ghost: "inline-flex items-center text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink",
} as const;

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
        <a href={props.href} className={className} target="_blank" rel="noopener noreferrer">
          {props.children}
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
