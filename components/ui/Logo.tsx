type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <span className={["logo", className].filter(Boolean).join(" ")}>
      Design<span className="logo-pool">pool</span>
    </span>
  );
}
