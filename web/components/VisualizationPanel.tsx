"use client";
import { useMemo, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

type VizKind = "bar" | "line" | "pie";

export default function VisualizationPanel({
  rows,
  xKey,
  yKey,
}: {
  rows: Array<Record<string, number | string>>;
  xKey: string;
  yKey: string;
}) {
  const [kind, setKind] = useState<VizKind>("bar");

  const labels = useMemo(() => rows.map((r) => String(r[xKey] ?? "")), [rows, xKey]);
  const dataValues = useMemo(() => rows.map((r) => Number(r[yKey] ?? 0)), [rows, yKey]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: yKey,
          data: dataValues,
          backgroundColor: "rgba(34, 211, 238, 0.45)",
          borderColor: "rgba(99, 102, 241, 0.9)",
          borderWidth: 1,
          pointRadius: 3,
          pointBackgroundColor: "rgba(99, 102, 241, 1)",
        },
      ],
    }),
    [labels, dataValues, yKey]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setKind("bar")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            kind === "bar" ? "bg-zinc-900 text-white" : "glass"
          }`}
        >
          Bar
        </button>
        <button
          onClick={() => setKind("line")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            kind === "line" ? "bg-zinc-900 text-white" : "glass"
          }`}
        >
          Line
        </button>
        <button
          onClick={() => setKind("pie")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            kind === "pie" ? "bg-zinc-900 text-white" : "glass"
          }`}
        >
          Pie
        </button>
      </div>
      <div className="glass rounded-2xl p-3">
        {kind === "bar" && <Bar data={data} />}
        {kind === "line" && <Line data={data} />}
        {kind === "pie" && <Pie data={data} />}
      </div>
    </div>
  );
}

