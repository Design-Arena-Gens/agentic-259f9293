type FixSuggestion = {
  issue: string;
  fix: string;
};

export default function ErrorFixerPanel({
  suggestions,
  onApply,
}: {
  suggestions: FixSuggestion[];
  onApply: (fix: string) => void;
}) {
  return (
    <div className="space-y-2">
      {suggestions.length === 0 && (
        <div className="text-zinc-500 text-sm">No errors detected.</div>
      )}
      {suggestions.map((s, i) => (
        <div key={i} className="glass rounded-xl p-3">
          <div className="text-zinc-800 font-medium">{s.issue}</div>
          <div className="text-zinc-600 text-sm">{s.fix}</div>
          <button
            onClick={() => onApply(s.fix)}
            className="mt-2 rounded-full bg-zinc-900 text-white text-xs font-medium px-3 py-1 hover:opacity-90"
          >
            Apply fix
          </button>
        </div>
      ))}
    </div>
  );
}

