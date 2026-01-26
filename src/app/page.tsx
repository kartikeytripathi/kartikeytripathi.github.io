import {
  CallToAction,
  Certifications,
  FadeInUp,
  HeroSection,
  Projects,
  TechnicalSkills,
  WorkExperience,
  ContributionGraph,
} from "@/components";



export default function Portfolio() {
  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-8 bg-background text-foreground">
      <FadeInUp delay={0.1}>
  <HeroSection />
</FadeInUp>

<FadeInUp delay={0.2}>
  <WorkExperience />
</FadeInUp>

<FadeInUp delay={0.3}>
  <TechnicalSkills />
</FadeInUp>

<FadeInUp delay={0.4}>
  <Projects />
</FadeInUp>

<FadeInUp delay={0.5}>
  <Certifications />
</FadeInUp>

<FadeInUp delay={0.55}>
  <ContributionGraph />
</FadeInUp>


<FadeInUp delay={0.6}>
  <CallToAction />
</FadeInUp>
    </main>
  );
}
