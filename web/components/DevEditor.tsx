import { useEffect, useRef } from "react";

export default function DevEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    ref.current?.style.setProperty("height", "0px");
    const scrollH = ref.current?.scrollHeight ?? 120;
    ref.current?.style.setProperty("height", Math.min(320, scrollH) + "px");
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className="w-full glass rounded-2xl p-4 font-mono text-sm text-zinc-800 leading-6 soft-scroll"
      placeholder="Write or refine SQL here..."
    />
  );
}

