import { useState, useEffect } from "react";
import clsx from "clsx";

type FloatingInputProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
};

export default function FloatingInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe your data question in natural language?",
  className,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    const hints = [
      "e.g., total sales by month this year",
      "e.g., top 5 customers by revenue",
      "e.g., orders with delayed shipments last quarter",
      "e.g., daily active users by country",
    ];
    const id = setInterval(() => {
      setHint((prev) => {
        const next = hints[(hints.indexOf(prev) + 1) % hints.length] || hints[0];
        return next;
      });
    }, 3500);
    setHint(hints[0]);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={clsx(
        "glass neon hover-float depth rounded-full px-5 py-3 sm:px-7 sm:py-4",
        "flex items-center gap-3 w-full",
        className
      )}
      role="search"
    >
      <div
        aria-hidden
        className={clsx(
          "size-2.5 rounded-full",
          focused ? "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.6)]" : "bg-zinc-300"
        )}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        placeholder={placeholder}
        className="glass-input w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 rounded-full px-4 py-2"
        aria-label="Natural language query input"
      />
      <span className="hidden sm:block text-xs text-zinc-500">{hint}</span>
      <button
        onClick={onSubmit}
        className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-white text-sm font-medium px-4 py-2 hover:opacity-90 active:opacity-100 transition"
        aria-label="Generate SQL"
      >
        Generate
      </button>
    </div>
  );
}

