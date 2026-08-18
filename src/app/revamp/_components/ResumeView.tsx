"use client";

import { FiDownload, FiX } from "react-icons/fi";
import {
  personalInfo,
  workExperience,
  certifications,
  techStack,
  projects,
  socialLinks,
} from "@/config/data";

const skillGroups = Array.from(
  techStack
    .filter((t) => t.type !== "Project")
    .reduce((map, t) => {
      map.set(t.type, [...(map.get(t.type) ?? []), t.name]);
      return map;
    }, new Map<string, string[]>())
);

/**
 * The recruiter escape hatch — a clean, plain, print-ready résumé. No theming,
 * no jargon. "Download PDF" triggers the browser print dialog.
 */
export function ResumeView({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <FiX className="h-4 w-4" /> back to interactive view
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
        >
          <FiDownload className="h-4 w-4" /> Download PDF
        </button>
      </div>

      <main className="mx-auto max-w-3xl px-8 py-10">
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold">{personalInfo.name}</h1>
          <p className="text-gray-700">{personalInfo.title}</p>
          <p className="mt-1 text-sm text-gray-500">
            {personalInfo.location} ·{" "}
            <a href={`mailto:${personalInfo.email}`} className="underline">
              {personalInfo.email}
            </a>{" "}
            ·{" "}
            {socialLinks.map((s, i) => (
              <span key={s.id}>
                {i > 0 && " · "}
                <a href={s.url} className="underline">
                  {s.title}
                </a>
              </span>
            ))}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {personalInfo.description}
          </p>
        </header>

        <Section title="Experience">
          <div className="space-y-4">
            {workExperience.map((r) => (
              <div key={`${r.company}-${r.period}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold">
                    {r.position} — {r.company}
                  </h3>
                  <span className="text-sm text-gray-500">{r.period}</span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                  {r.bulletPoints.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.title} className="text-sm">
                <a href={p.liveUrl} className="font-semibold underline">
                  {p.title}
                </a>{" "}
                <span className="text-gray-700">— {p.description}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="space-y-1 text-sm">
            {skillGroups.map(([group, names]) => (
              <p key={group}>
                <span className="font-semibold">{group}: </span>
                <span className="text-gray-700">{names.join(", ")}</span>
              </p>
            ))}
          </div>
        </Section>

        <Section title="Certifications">
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-gray-700">
            {certifications.map((c) => (
              <li key={c.title}>
                {c.title} — {c.issuer} ({c.issued})
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
