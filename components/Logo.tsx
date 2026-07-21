export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src="/saimo-logo.png"
      className={className}
      alt="SAIMO logo"
    />
  );
}

export function LogoLockup({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const textColor = variant === "dark" ? "text-navy-900" : "text-white";
  const subColor = variant === "dark" ? "text-ink-500" : "text-white/60";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <span className={`font-display text-lg font-bold tracking-tight ${textColor}`}>
          SAIMO
        </span>
        <span className={`text-[10px] uppercase tracking-[0.18em] ${subColor}`}>
          Gestion scolaire
        </span>
      </div>
    </div>
  );
}
