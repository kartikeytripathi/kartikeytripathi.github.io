export type SectionMeta = {
  id: string;
  label: string;
  kind: string;
};

/** The site's resources — drives the left rail nav and the ⌘K palette. */
export const SECTIONS: SectionMeta[] = [
  { id: "now", label: "now", kind: "EventStream" },
  { id: "experience", label: "experience", kind: "Deployment" },
  { id: "projects", label: "projects", kind: "Resource" },
  { id: "skills", label: "skills", kind: "DependencyGraph" },
  { id: "content", label: "content", kind: "Stream" },
  { id: "signals", label: "signals", kind: "Metrics" },
  { id: "certs", label: "certs", kind: "Condition" },
  { id: "contact", label: "contact", kind: "Service" },
];
