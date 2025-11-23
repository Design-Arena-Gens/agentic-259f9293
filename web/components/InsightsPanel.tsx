type Insights = {
  complexity: "Low" | "Medium" | "High";
  tables: string[];
  joins: number;
  estimatedRows: string;
  operations: string[];
};

export default function InsightsPanel({ insights }: { insights: Insights }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="glass rounded-xl p-3">
        <div className="text-xs text-zinc-500">Complexity</div>
        <div className="text-zinc-800 font-semibold">{insights.complexity}</div>
      </div>
      <div className="glass rounded-xl p-3">
        <div className="text-xs text-zinc-500">Tables</div>
        <div className="text-zinc-800 font-semibold">{insights.tables.join(", ") || "?"}</div>
      </div>
      <div className="glass rounded-xl p-3">
        <div className="text-xs text-zinc-500">Joins</div>
        <div className="text-zinc-800 font-semibold">{insights.joins}</div>
      </div>
      <div className="glass rounded-xl p-3">
        <div className="text-xs text-zinc-500">Est. Rows</div>
        <div className="text-zinc-800 font-semibold">{insights.estimatedRows}</div>
      </div>
      <div className="col-span-2 sm:col-span-4 glass rounded-xl p-3">
        <div className="text-xs text-zinc-500">Operations</div>
        <div className="text-zinc-800 font-semibold">
          {insights.operations.length ? insights.operations.join(" ? ") : "?"}
        </div>
      </div>
    </div>
  );
}

