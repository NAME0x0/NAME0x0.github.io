"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useState } from "react";
import Navigation from "@/components/ui/Navigation";
import SectionOrchestrator from "@/components/motion/SectionOrchestrator";

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePos, setMousePos] = useState<[number, number]>([0, 0]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePos([
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    ]);
  }, []);

  useEffect(() => {
    const onProgress: EventListener = (event) => {
      const customEvent = event as CustomEvent<ScrollProgressDetail>;
      setScrollProgress(customEvent.detail.progress);
    };

    const onSection: EventListener = (event) => {
      const customEvent = event as CustomEvent<ActiveSectionDetail>;
      setActiveSection(customEvent.detail.section);
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
          scrollProgress={scrollProgress}
          activeSection={activeSection}
          mousePosition={mousePos}
        />
      </Suspense>

      <Navigation />
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
