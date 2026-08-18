import type { Metadata } from "next";
import { RevampShell } from "./_components/RevampShell";

export const metadata: Metadata = {
  title: "Revamp — The Reconciliation Loop",
  robots: { index: false, follow: false },
};

export default function RevampPreview() {
  return <RevampShell />;
}
