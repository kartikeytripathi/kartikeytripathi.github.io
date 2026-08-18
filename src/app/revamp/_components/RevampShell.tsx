"use client";

import { useCallback, useEffect, useState } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { ReconcileBar } from "./ReconcileBar";
import { LeftRail } from "./LeftRail";
import { CommandPalette } from "./CommandPalette";
import { ResumeView } from "./ResumeView";
import { SpecStatusHero } from "./SpecStatusHero";
import { NowWatch } from "./NowWatch";
import { ExperienceDeployments } from "./ExperienceDeployments";
import { ProjectsReconciled } from "./ProjectsReconciled";
import { SkillGraph } from "./SkillGraph";
import { ContentHub } from "./ContentHub";
import { Signals } from "./Signals";
import { CertConditions } from "./CertConditions";
import { ApplyContact } from "./ApplyContact";

export function RevampShell() {
  const [recruiter, setRecruiter] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleRecruiter = useCallback(() => setRecruiter((v) => !v), []);

  // ⌘K / Ctrl+K opens the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (recruiter) {
    return <ResumeView onExit={toggleRecruiter} />;
  }

  return (
    <SmoothScroll>
      <ReconcileBar
        onOpenPalette={() => setPaletteOpen(true)}
        onToggleRecruiter={toggleRecruiter}
      />
      <LeftRail onNavigate={navigate} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
        onToggleRecruiter={toggleRecruiter}
      />

      <main className="bg-black text-white">
        <SpecStatusHero />
        <NowWatch />
        <ExperienceDeployments />
        <ProjectsReconciled />
        <SkillGraph />
        <ContentHub />
        <Signals />
        <CertConditions />
        <ApplyContact />

        <footer className="mx-auto max-w-4xl px-6 pb-24 pt-6 font-mono text-xs text-gray-700">
          © 2026 Kartikey Tripathi · rendered by a controller that never stops
          reconciling
        </footer>
      </main>
    </SmoothScroll>
  );
}
