import clsx from "clsx";

type SQLOutputProps = {
  sql: string;
  onCopy?: () => void;
  className?: string;
};

export default function SQLOutput({ sql, onCopy, className }: SQLOutputProps) {
  return (
    <div className={clsx("relative", className)}>
      <pre className="glass hover-float accent-ring rounded-2xl p-4 sm:p-5 text-sm leading-6 text-zinc-800 overflow-auto soft-scroll">
        <code>{sql || "/* SQL will appear here */"}</code>
      </pre>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(sql);
            onCopy?.();
          }}
          className="rounded-full bg-white/70 hover:bg-white text-zinc-800 text-xs font-medium px-3 py-1 shadow"
          aria-label="Copy SQL"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

