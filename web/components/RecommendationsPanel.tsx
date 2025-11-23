type Recommendation = {
  title: string;
  detail?: string;
};

export default function RecommendationsPanel({
  items,
}: {
  items: Recommendation[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((r, idx) => (
        <li
          key={idx}
          className="glass rounded-xl p-3 flex items-start gap-3"
        >
          <span className="mt-1 size-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
          <div>
            <div className="text-zinc-800 font-medium">{r.title}</div>
            {r.detail && <div className="text-zinc-600 text-sm">{r.detail}</div>}
          </div>
        </li>
      ))}
      {!items.length && (
        <li className="text-zinc-500 text-sm">No recommendations yet.</li>
      )}
    </ul>
  );
}

