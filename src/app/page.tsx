import {
  CallToAction,
  Certifications,
  FadeInUp,
  HeroSection,
  Projects,
  TechnicalSkills,
  WorkExperience,
  ContributionGraph,
  BlogSection,
  ErrorBoundary,
} from "@/components";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.kartikeytripathi.in/#person",
      name: "Kartikey Tripathi",
      jobTitle: "Cloud & DevOps Engineer",
      url: "https://www.kartikeytripathi.in",
      email: "kartikey.tripathi.37@gmail.com",
      image: "https://www.kartikeytripathi.in/images/about/KT.webp",
      sameAs: [
        "https://github.com/kartikeytripathi",
        "https://www.linkedin.com/in/kartikeytripathi",
        "https://www.instagram.com/kar.ti.key",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Amazon Web Services",
        url: "https://aws.amazon.com",
      },
      knowsAbout: [
        "AWS",
        "Kubernetes",
        "Docker",
        "DevOps",
        "Cloud Engineering",
        "EKS",
        "ECS",
        "Terraform",
        "CI/CD",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.kartikeytripathi.in/#website",
      name: "Kartikey Tripathi — Cloud & DevOps Engineer",
      url: "https://www.kartikeytripathi.in",
      author: { "@id": "https://www.kartikeytripathi.in/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://www.kartikeytripathi.in/#profilepage",
      url: "https://www.kartikeytripathi.in",
      name: "Kartikey Tripathi Portfolio",
      about: { "@id": "https://www.kartikeytripathi.in/#person" },
      mainEntity: { "@id": "https://www.kartikeytripathi.in/#person" },
    },
  ],
};

export default function Portfolio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
    <main className="max-w-4xl mx-auto p-6 lg:p-8 bg-background text-foreground">
      <FadeInUp delay={0.1}>
  <HeroSection />
</FadeInUp>

<div id="experience">
<FadeInUp delay={0.2}>
  <WorkExperience />
</FadeInUp>
</div>

<FadeInUp delay={0.3}>
  <TechnicalSkills />
</FadeInUp>

<div id="projects">
<FadeInUp delay={0.4}>
  <Projects />
</FadeInUp>
</div>

<FadeInUp delay={0.5}>
  <Certifications />
</FadeInUp>

<div id="blog">
<FadeInUp delay={0.55}>
  <BlogSection />
</FadeInUp>
</div>

<FadeInUp delay={0.6}>
  <ErrorBoundary>
    <ContributionGraph />
  </ErrorBoundary>
</FadeInUp>

<div id="contact">
<FadeInUp delay={0.65}>
  <CallToAction />
</FadeInUp>
</div>

<footer className="mt-12 pb-6 text-center text-sm text-muted-foreground">
  © 2026 Kartikey Tripathi
</footer>
    </main>
    </>
  );
}
