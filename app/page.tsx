"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsClient } from "@/lib/hooks/useIsClient";

const HeroThree = dynamic(() => import("@/components/HeroThree"), { ssr: false });
const SectionOrchestrator = dynamic(() => import("@/components/motion/SectionOrchestrator").then(m => ({ default: m.SectionOrchestrator })), { ssr: false });
const CinematicPrologue = dynamic(() => import("@/components/sections/CinematicPrologue").then(m => ({ default: m.CinematicPrologue })), { ssr: false });
const PrologueLogo = dynamic(() => import("@/components/sections/PrologueLogo").then(m => ({ default: m.PrologueLogo })), { ssr: false });
const Skills = dynamic(() => import("@/components/sections/Skills").then(m => ({ default: m.Skills })), { ssr: false });
const Projects = dynamic(() => import("@/components/sections/Projects").then(m => ({ default: m.Projects })), { ssr: false });
const GlobalPerspective = dynamic(() => import("@/components/sections/GlobalPerspective").then(m => ({ default: m.GlobalPerspective })), { ssr: false });
const TerminalInteractive = dynamic(() => import("@/components/sections/TerminalInteractive").then(m => ({ default: m.TerminalInteractive })), { ssr: false });
const DailyOps = dynamic(() => import("@/components/sections/DailyOps").then(m => ({ default: m.DailyOps })), { ssr: false });
const Contact = dynamic(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })), { ssr: false });

export default function Page() {
  const isClient = useIsClient();

  const LoadingSection = ({ className = "" }: { className?: string }) => (
    <div className={`h-screen flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-2 border-gunmetal border-t-electric rounded-full animate-spin" />
    </div>
  );

  return (
    <main id="main" role="main" aria-label="Muhammad Afsah Mumtaz Portfolio">
      {/* Only render after hydration to prevent mismatches */}
      {isClient && <SectionOrchestrator />}
      
      <section 
        id="prologue" 
        className="cinematic-section" 
        aria-labelledby="prologue-heading"
        role="banner"
      >
        <Suspense fallback={<LoadingSection />}> 
          <HeroThree />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <div className="relative flex h-screen items-center justify-center">
            <PrologueLogo />
          </div>
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <CinematicPrologue />
        </Suspense>
      </section>

      <section 
        id="skills" 
        className="cinematic-section" 
        aria-labelledby="skills-heading"
        role="region"
        aria-label="Technical Skills and Expertise"
      >
        <Suspense fallback={<LoadingSection />}>
          <Skills />
        </Suspense>
      </section>

      <section 
        id="projects" 
        className="cinematic-section" 
        aria-labelledby="projects-heading"
        role="region"
        aria-label="Featured Projects Portfolio"
      >
        <Suspense fallback={<LoadingSection />}>
          <Projects />
        </Suspense>
      </section>

      <section 
        id="global" 
        className="cinematic-section" 
        aria-labelledby="global-heading"
        role="region"
        aria-label="Global Perspective and International Experience"
      >
        <Suspense fallback={<LoadingSection />}>
          <GlobalPerspective />
        </Suspense>
      </section>

      <section 
        id="terminal" 
        className="cinematic-section bg-gunmetal/40" 
        aria-labelledby="terminal-heading"
        role="region"
        aria-label="Interactive Terminal Command Center"
      >
        <Suspense fallback={<LoadingSection className="bg-gunmetal/40" />}>
          <TerminalInteractive />
        </Suspense>
      </section>

      <section 
        id="ops" 
        className="cinematic-section" 
        aria-labelledby="ops-heading"
        role="region"
        aria-label="Daily Operations and Live Metrics"
      >
        <Suspense fallback={<LoadingSection />}>
          <DailyOps />
        </Suspense>
      </section>

      <section 
        id="contact" 
        className="cinematic-section" 
        aria-labelledby="contact-heading"
        role="region"
        aria-label="Contact Information and Form"
      >
        <Suspense fallback={<LoadingSection />}>
          <Contact />
        </Suspense>
      </section>
    </main>
  );
}

