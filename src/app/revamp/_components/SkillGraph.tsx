"use client";

import { useState } from "react";
import { SectionHeading } from "./SectionHeading";

type Node = { id: string; label: string; x: number; y: number };
type Edge = [string, string];

// A curated dependency story — how the stack actually composes, not a tag cloud.
const nodes: Node[] = [
  { id: "tf", label: "Terraform", x: 120, y: 70 },
  { id: "k8s", label: "Kubernetes", x: 120, y: 210 },
  { id: "docker", label: "Docker", x: 110, y: 350 },
  { id: "ecr", label: "ECR", x: 290, y: 350 },
  { id: "net", label: "Networking", x: 400, y: 60 },
  { id: "eks", label: "EKS", x: 400, y: 210 },
  { id: "gha", label: "GitHub Actions", x: 410, y: 380 },
  { id: "karpenter", label: "Karpenter", x: 660, y: 90 },
  { id: "irsa", label: "IRSA", x: 690, y: 210 },
  { id: "argo", label: "ArgoCD", x: 630, y: 350 },
];

const edges: Edge[] = [
  ["tf", "eks"],
  ["k8s", "eks"],
  ["docker", "ecr"],
  ["ecr", "eks"],
  ["net", "eks"],
  ["eks", "karpenter"],
  ["eks", "irsa"],
  ["argo", "eks"],
  ["gha", "argo"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function SkillGraph() {
  const [active, setActive] = useState<string | null>(null);

  const neighbors = new Set<string>();
  if (active) {
    neighbors.add(active);
    edges.forEach(([a, b]) => {
      if (a === active) neighbors.add(b);
      if (b === active) neighbors.add(a);
    });
  }

  const isEdgeLit = (a: string, b: string) =>
    active === a || active === b;
  const isNodeLit = (id: string) => !active || neighbors.has(id);

  return (
    <section id="skills" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="DependencyGraph"
        name="skills"
        hint="# hover a node to trace its dependencies"
      />

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A] p-2">
        <svg
          viewBox="0 0 800 430"
          className="w-full min-w-[640px]"
          role="img"
          aria-label="Skill dependency graph"
        >
          {/* edges */}
          {edges.map(([a, b]) => {
            const na = byId[a];
            const nb = byId[b];
            const lit = isEdgeLit(a, b);
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={lit ? "#F5C842" : "#ffffff"}
                strokeOpacity={active ? (lit ? 0.8 : 0.06) : 0.14}
                strokeWidth={lit ? 2 : 1}
                className="transition-all duration-200"
              />
            );
          })}

          {/* nodes */}
          {nodes.map((n) => {
            const lit = isNodeLit(n.id);
            const isActive = active === n.id;
            const w = n.label.length * 7.5 + 28;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: lit ? 1 : 0.25 }}
              >
                <rect
                  x={-w / 2}
                  y={-14}
                  width={w}
                  height={28}
                  rx={14}
                  fill={isActive ? "#F5C842" : "#0A0A0A"}
                  stroke={isActive ? "#F5C842" : "#ffffff"}
                  strokeOpacity={isActive ? 1 : 0.2}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12.5"
                  fontFamily="var(--font-mono), monospace"
                  fill={isActive ? "#0A0A0A" : "#E8E8E8"}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
