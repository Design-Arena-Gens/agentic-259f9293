import { ReactNode } from "react";
import clsx from "clsx";

type GlassCardProps = {
  className?: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function GlassCard({
  className,
  children,
  title,
  subtitle,
}: GlassCardProps) {
  return (
    <section
      className={clsx(
        "glass neon hover-float depth accent-ring rounded-3xl p-5 sm:p-6",
        "transition-all",
        className
      )}
      aria-label={title}
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && (
            <h3 className="text-zinc-800 text-lg sm:text-xl font-semibold tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-zinc-600 text-sm sm:text-base">{subtitle}</p>
          )}
        </header>
      )}
      <div className="soft-scroll">{children}</div>
    </section>
  );
}

