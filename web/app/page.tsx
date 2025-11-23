/* eslint-disable react/no-unescaped-entities */
"use client";
import { useMemo, useState } from "react";
import FloatingInput from "@/components/FloatingInput";
import GlassCard from "@/components/GlassCard";
import SQLOutput from "@/components/SQLOutput";
import InsightsPanel from "@/components/InsightsPanel";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import ExplanationCard from "@/components/ExplanationCard";
import ErrorFixerPanel from "@/components/ErrorFixerPanel";
import VisualizationPanel from "@/components/VisualizationPanel";
import SecurityAnalyzer from "@/components/SecurityAnalyzer";
import SchemaGraph, { GraphLink, GraphNode } from "@/components/SchemaGraph";
import DevEditor from "@/components/DevEditor";

export default function Home() {
  const [nlq, setNlq] = useState("");
  const [sql, setSql] = useState("");
  const [devSql, setDevSql] = useState("");

  const onGenerate = () => {
    const generated = generateSQL(nlq);
    setSql(generated);
    setDevSql(generated);
  };

  const insights = useMemo(() => deriveInsights(sql), [sql]);
  const fixes = useMemo(() => findFixes(devSql), [devSql]);
  const securityIssues = useMemo(() => analyzeSecurity(devSql), [devSql]);
  const explanation = useMemo(() => explainSQL(sql), [sql]);

  const sampleRows = useMemo(() => mockRowsFromSQL(sql), [sql]);
  const [xKey, yKey] = useMemo(() => pickKeys(sampleRows), [sampleRows]);

  const schema = useMemo(() => deriveSchema(insights.tables), [insights.tables]);

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/40 border-b border-white/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
            <h1 className="text-zinc-800 font-semibold tracking-tight">
              AI SQL Query Generator
            </h1>
          </div>
          <div className="text-xs text-zinc-600">Futuristic anti-gravity UI</div>
        </div>
      </header>

      {/* Hero + Input */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-14 space-y-5">
        <FloatingInput value={nlq} onChange={setNlq} onSubmit={onGenerate} />
        <p className="text-center sm:text-left text-zinc-600">
          Natural language to SQL, with insights, fixes, visualization, and security.
        </p>
      </div>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <GlassCard title="SQL Output" subtitle="Generated query">
            <SQLOutput sql={sql} />
          </GlassCard>

          <GlassCard title="Query Insights" subtitle="Structure and cost estimate">
            <InsightsPanel insights={insights} />
          </GlassCard>

          <GlassCard title="Recommendations" subtitle="Optimizations and best practices">
            <RecommendationsPanel items={recommendationsFromInsights(insights)} />
          </GlassCard>
        </div>

        {/* Middle column */}
        <div className="space-y-6">
          <GlassCard title="SQL Explanation" subtitle="Plain-English breakdown">
            <ExplanationCard text={explanation} />
          </GlassCard>

          <GlassCard title="Auto Visualization" subtitle="Instant chart from result shape">
            <VisualizationPanel rows={sampleRows} xKey={xKey} yKey={yKey} />
          </GlassCard>

          <GlassCard title="Developer SQL Editor" subtitle="Refine and test the query">
            <DevEditor value={devSql} onChange={setDevSql} />
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <GlassCard title="Error Fixer" subtitle="Auto-detect and apply quick fixes">
            <ErrorFixerPanel
              suggestions={fixes}
              onApply={(fix) => setDevSql((s) => applyFix(s, fix))}
            />
          </GlassCard>

          <GlassCard title="Security Analyzer" subtitle="Injection, risky patterns, data exfiltration">
            <SecurityAnalyzer issues={securityIssues} />
          </GlassCard>

          <GlassCard title="Schema Graph" subtitle="Floating tables and relationships">
            <SchemaGraph nodes={schema.nodes} links={schema.links} />
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

// ????? Logic utilities ?????
function generateSQL(nlq: string): string {
  const q = nlq.toLowerCase();
  if (!q.trim()) return "";
  if (q.includes("top") && q.includes("customers")) {
    return `SELECT c.name, SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;`;
  }
  if (q.includes("sales") && (q.includes("month") || q.includes("monthly"))) {
    return `SELECT DATE_TRUNC('month', o.order_date) AS month, SUM(oi.quantity * oi.unit_price) AS sales
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY month
ORDER BY month;`;
  }
  if (q.includes("daily active users") || q.includes("dau")) {
    return `SELECT DATE(u.last_active_at) AS day, COUNT(DISTINCT u.id) AS dau
FROM users u
GROUP BY day
ORDER BY day;`;
  }
  // Fallback
  return `SELECT *
FROM your_table
WHERE 1=1
LIMIT 100;`;
}

function deriveInsights(sql: string) {
  const tables = Array.from(
    new Set(
      (sql.match(/\bfrom\s+([a-zA-Z0-9_\.]+)/gi) || [])
        .map((m) => m.split(/\s+/)[1])
        .concat(
          (sql.match(/\bjoin\s+([a-zA-Z0-9_\.]+)/gi) || []).map(
            (m) => m.split(/\s+/)[1]
          )
        )
    )
  );
  const joins = (sql.match(/\bjoin\b/gi) || []).length;
  const operations = [
    /\bwhere\b/i.test(sql) ? "Filter" : null,
    /\bgroup by\b/i.test(sql) ? "Group" : null,
    /\border by\b/i.test(sql) ? "Sort" : null,
    /\blimit\b/i.test(sql) ? "Limit" : null,
  ].filter(Boolean) as string[];
  const complexity: "Low" | "Medium" | "High" =
    joins >= 3 || operations.length >= 3 ? "High" : joins >= 1 ? "Medium" : "Low";
  const estimatedRows =
    complexity === "High" ? "100k+" : complexity === "Medium" ? "10k+" : "1k+";
  return { complexity, tables, joins, estimatedRows, operations };
}

function recommendationsFromInsights(ins: ReturnType<typeof deriveInsights>) {
  const recs: { title: string; detail?: string }[] = [];
  if (!/\blimit\b/i.test(ins as any)) {
    // noop - detection handled elsewhere
  }
  if (ins.joins >= 3) {
    recs.push({
      title: "Consider pre-aggregating large joins",
      detail: "Materialize or cache heavy intermediate results to improve latency.",
    });
  }
  if (!ins.operations.includes("Limit")) {
    recs.push({
      title: "Add LIMIT for preview",
      detail: "Use LIMIT during exploration to reduce scan costs.",
    });
  }
  if (!ins.operations.includes("Sort") && ins.operations.includes("Group")) {
    recs.push({
      title: "Sort by metric for readability",
      detail: "ORDER BY the aggregated metric to surface top values.",
    });
  }
  if (ins.tables.length >= 2 && !ins.operations.includes("Filter")) {
    recs.push({
      title: "Add selective filters",
      detail: "Reduce joined row explosion by filtering early.",
    });
  }
  return recs;
}

function explainSQL(sql: string) {
  if (!sql.trim()) return "";
  const hasGroup = /\bgroup by\b/i.test(sql);
  const hasJoin = /\bjoin\b/i.test(sql);
  const hasWhere = /\bwhere\b/i.test(sql);
  return [
    "This query",
    hasJoin ? "joins multiple tables" : "reads from a single table",
    hasWhere ? "with filters applied" : "without filters",
    hasGroup ? "and aggregates results by group." : "and returns raw rows.",
  ].join(" ");
}

function findFixes(sql: string) {
  const fixes: { issue: string; fix: string }[] = [];
  if (/\bselet\b/i.test(sql)) {
    fixes.push({
      issue: "Typo detected: 'SELET'",
      fix: "Replace 'SELET' with 'SELECT'",
    });
  }
  if (/select\s+\*\s+from\s+[a-z0-9_]+;?$/i.test(sql) && !/\blimit\b/i.test(sql)) {
    fixes.push({
      issue: "Full table scan without LIMIT",
      fix: "Append 'LIMIT 100' for safety",
    });
  }
  if (/\bdelete\b|\bdrop\b|\btruncate\b/i.test(sql)) {
    fixes.push({
      issue: "Destructive command detected",
      fix: "Ensure READ-ONLY by removing DDL/DML statements",
    });
  }
  return fixes;
}

function applyFix(current: string, fix: string) {
  if (fix.includes("Replace 'SELET'")) {
    return current.replace(/selet/gi, "SELECT");
  }
  if (fix.includes("Append 'LIMIT 100'")) {
    return current.replace(/;?\s*$/g, " LIMIT 100;");
  }
  if (fix.includes("READ-ONLY")) {
    return current.replace(/\bdelete\b|\bdrop\b|\btruncate\b/gi, "-- removed");
  }
  return current;
}

function analyzeSecurity(sql: string) {
  const issues: { level: "info" | "warn" | "critical"; message: string }[] = [];
  if (/\b;\s*--/.test(sql) || /--\s*$/m.test(sql)) {
    issues.push({
      level: "warn",
      message: "Inline comments may mask SQL; sanitize user inputs.",
    });
  }
  if (/\bor\s+1\s*=\s*1\b/i.test(sql)) {
    issues.push({ level: "critical", message: "Possible tautology injection pattern detected." });
  }
  if (/\bunion\s+select\b/i.test(sql)) {
    issues.push({ level: "warn", message: "UNION SELECT may expose unrelated data." });
  }
  if (/\bselect\s+\*\b/i.test(sql)) {
    issues.push({ level: "info", message: "SELECT * used; prefer explicit columns." });
  }
  return issues;
}

function mockRowsFromSQL(sql: string) {
  if (/\bdau\b|daily active users/i.test(sql)) {
    return Array.from({ length: 7 }).map((_, i) => ({
      day: `Day ${i + 1}`,
      dau: Math.round(200 + Math.random() * 100),
    }));
  }
  if (/sales/i.test(sql)) {
    return ["Jan", "Feb", "Mar", "Apr", "May"].map((m) => ({
      month: m,
      sales: Math.round(10000 + Math.random() * 8000),
    }));
  }
  return ["A", "B", "C", "D", "E"].map((n) => ({
    label: n,
    value: Math.round(50 + Math.random() * 100),
  }));
}

function pickKeys(rows: Array<Record<string, any>>): [string, string] {
  if (!rows.length) return ["label", "value"];
  const sample = rows[0];
  const keys = Object.keys(sample);
  const num = keys.find((k) => typeof sample[k] === "number") || "value";
  const str = keys.find((k) => typeof sample[k] === "string") || "label";
  return [str, num];
}

function deriveSchema(tables: string[]): { nodes: GraphNode[]; links: GraphLink[] } {
  if (!tables.length) {
    const nodes = ["users", "orders", "order_items", "products", "customers"].map((t) => ({
      id: t,
      label: t,
    }));
    const links: GraphLink[] = [
      { source: "orders", target: "customers" },
      { source: "order_items", target: "orders" },
      { source: "order_items", target: "products" },
      { source: "users", target: "orders" },
    ];
    return { nodes, links };
  }
  const nodes = tables.map((t) => ({ id: t, label: t }));
  const links: GraphLink[] = [];
  for (let i = 0; i < tables.length - 1; i++) {
    links.push({ source: tables[i], target: tables[i + 1] });
  }
  return { nodes, links };
}
