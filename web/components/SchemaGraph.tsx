"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3-force";

export type GraphNode = {
  id: string;
  label: string;
};
export type GraphLink = {
  source: string;
  target: string;
};

export default function SchemaGraph({
  nodes,
  links,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
}) {
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { width, height } = useContainerSize(containerRef);

  useEffect(() => {
    if (!width || !height) return;
    const sim = d3
      .forceSimulation(
        nodes.map((n) => ({
          id: n.id,
          x: Math.random() * width,
          y: Math.random() * height,
        })) as d3.SimulationNodeDatum[]
      )
      .force(
        "link",
        d3.forceLink(
          links.map((l) => ({ source: l.source, target: l.target }))
        )
          .id((d: any) => d.id)
          .distance(100)
          .strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(40))
      .alphaDecay(0.03)
      .on("tick", () => {
        const current: Record<string, { x: number; y: number }> = {};
        (sim.nodes() as any).forEach((n: any) => {
          current[n.id] = { x: n.x, y: n.y };
        });
        setPositions(current);
      });
    const t = setTimeout(() => sim.stop(), 4000);
    return () => {
      clearTimeout(t);
      sim.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <div ref={containerRef} className="relative w-full h-72">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.6)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
          </linearGradient>
        </defs>
        <g>
          {links.map((l, idx) => {
            const s = positions[l.source];
            const t = positions[l.target];
            if (!s || !t) return null;
            return (
              <line
                key={idx}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke="url(#edge)"
                strokeWidth={2}
                opacity={0.8}
              />
            );
          })}
        </g>
      </svg>
      {nodes.map((n) => {
        const p = positions[n.id];
        if (!p) return null;
        return (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 glass hover-float rounded-2xl px-3 py-2 text-xs text-zinc-800"
            style={{
              left: p.x,
              top: p.y,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
              <span className="font-semibold">{n.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [rect, setRect] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setRect({ width: r.width, height: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return rect;
}

