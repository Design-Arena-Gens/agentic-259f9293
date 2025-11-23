type SecurityIssue = {
  level: "info" | "warn" | "critical";
  message: string;
};

export default function SecurityAnalyzer({
  issues,
}: {
  issues: SecurityIssue[];
}) {
  const color = (level: SecurityIssue["level"]) =>
    level === "critical"
      ? "text-red-600"
      : level === "warn"
      ? "text-amber-600"
      : "text-zinc-600";

  return (
    <ul className="space-y-2">
      {issues.map((i, idx) => (
        <li key={idx} className="glass rounded-xl p-3">
          <div className={`text-sm font-medium ${color(i.level)}`}>{i.level.toUpperCase()}</div>
          <div className="text-zinc-800">{i.message}</div>
        </li>
      ))}
      {!issues.length && <li className="text-zinc-500 text-sm">No security issues found.</li>}
    </ul>
  );
}

