export default function ExplanationCard({ text }: { text: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-sm leading-6 text-zinc-700">
      {text || "Explanation of the SQL will appear here."}
    </div>
  );
}

