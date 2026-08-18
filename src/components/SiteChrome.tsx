"use client";

import { usePathname } from "next/navigation";
import {
  Header,
  CursorSpotlight,
  ScrollProgress,
  BackToTop,
  FloatingLove,
} from "@/components";

/**
 * Global site chrome (nav, scroll UI, view counter). Suppressed on the
 * /revamp preview so it can present its own self-contained layout.
 */
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/revamp")) return null;

  return (
    <>
      <ScrollProgress />
      <CursorSpotlight />
      <Header />
      <BackToTop />
      <FloatingLove />
    </>
  );
}
