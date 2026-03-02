"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Navigation from "@/components/ui/Navigation";
import SectionOrchestrator from "@/components/motion/SectionOrchestrator";
import { isSectionId, type SectionId } from "@/lib/navigation/sections";

const SceneContainer = dynamic(() => import("@/components/three/SceneContainer"), {
  ssr: false,
});

const Hero = dynamic(() => import("@/components/sections/Hero"));
const SovereignStack = dynamic(() => import("@/components/sections/SovereignStack"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const About = dynamic(() => import("@/components/sections/About"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

type ScrollProgressDetail = {
  progress: number;
};

type ActiveSectionDetail = {
  section: string;
};

function SectionShimmer() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-busy="true">
      <div className="h-1 w-24 animate-pulse rounded-full bg-ink-faint" />
    </div>
  );
}

export default function Page() {
  const scrollProgressRef = useRef(0);
  const mousePosRef = useRef<[number, number]>([0, 0]);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  const handleMouseMove = useCallback((event: MouseEvent) => {
    mousePosRef.current = [
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    ];
  }, []);

  useEffect(() => {
    const onProgress: EventListener = (event) => {
      const customEvent = event as CustomEvent<ScrollProgressDetail>;
      scrollProgressRef.current = customEvent.detail.progress;
    };

    const onSection: EventListener = (event) => {
      const customEvent = event as CustomEvent<ActiveSectionDetail>;
      if (isSectionId(customEvent.detail.section)) {
        setActiveSection(customEvent.detail.section);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("portfolio-scroll-progress", onProgress);
    window.addEventListener("portfolio-section-active", onSection);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("portfolio-scroll-progress", onProgress);
      window.removeEventListener("portfolio-section-active", onSection);
    };
  }, [handleMouseMove]);

  return (
    <>
      <Suspense fallback={null}>
        <SceneContainer
          scrollProgressRef={scrollProgressRef}
          mousePosRef={mousePosRef}
        />
      </Suspense>

      <Navigation activeSection={activeSection} />
      <SectionOrchestrator />

      <main
        id="main"
        role="main"
        aria-label="Muhammad Afsah Mumtaz portfolio"
        className="relative z-10"
      >
        <Suspense fallback={<SectionShimmer />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionShimmer />}>
          <SovereignStack />
        </Suspense>
        <Suspense fallback={<SectionShimmer />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionShimmer />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionShimmer />}>
          <Contact />
        </Suspense>
      </main>
    </>
  );
}
