"use client";

import { ReconcileProject, type ReconcileProjectData } from "./ReconcileProject";
import { SectionHeading } from "./SectionHeading";

const projects: ReconcileProjectData[] = [
  {
    name: "KubeForge",
    summary:
      "Hands-on Kubernetes & Amazon EKS learning platform for engineers pursuing CKA or moving into DevOps.",
    href: "https://kubeforge.kartikeytripathi.in",
    desired: [
      "a lab for every core K8s + EKS concept",
      "learners can trust they got it right without a mentor",
    ],
    converged: [
      "38 labs shipped across 4 phases (core K8s → production EKS)",
      "every lab ships with automated verification",
    ],
    metrics: [
      { label: "labs", value: "38" },
      { label: "phases", value: "4" },
      { label: "verification", value: "automated" },
    ],
  },
  {
    name: "QuizLens",
    summary:
      "Chrome extension that turns any practice question into a structured breakdown — for grinding AWS & CKA banks without alt-tabbing.",
    href: "https://github.com/kartikeytripathi/quizlens",
    desired: [
      "study cert banks without leaving the quiz",
      "answers with reasoning, not just the letter",
    ],
    converged: [
      "Alt+Q overlay: Answer, Why, per-option Elimination, Key Rule",
      "zero context-switching between quiz, docs, and chat",
    ],
    metrics: [
      { label: "shortcut", value: "Alt+Q" },
      { label: "surface", value: "any page" },
    ],
  },
];

export function ProjectsReconciled() {
  return (
    <section id="projects" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="Resource"
        name="projects"
        hint="# expand to diff desired against what converged"
      />
      <div className="space-y-4">
        {projects.map((p) => (
          <ReconcileProject key={p.name} data={p} />
        ))}
      </div>
    </section>
  );
}
