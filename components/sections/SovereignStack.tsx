"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOVEREIGN_STACK } from "@/lib/data/curated";
import { MOTION } from "@/lib/motion/motionTokens";

gsap.registerPlugin(ScrollTrigger);

type SovereignStackLayer = {
  name: string;
  description: string;
  technologies: readonly string[];
};

type LegacySovereignStackLayer = {
  label: string;
  description: string;
  tech: string;
};

function normalizeLayer(
  layer: SovereignStackLayer | LegacySovereignStackLayer
): SovereignStackLayer {
  if ("name" in layer && "technologies" in layer) {
    return layer;
  }

  return {
    name: layer.label,
    description: layer.description,
    technologies: layer.tech.split("·").map((part) => part.trim()),
  };
}

const stackLayers = SOVEREIGN_STACK.map((layer) => normalizeLayer(layer));

export function SovereignStack() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const layersContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const sectionEl = sectionRef.current;
      const headerEl = headerRef.current;
      const layersContainerEl = layersContainerRef.current;

      if (!sectionEl || !headerEl || !layersContainerEl) {
        return;
      }

      gsap.from(headerEl, {
        x: -MOTION.translate.card,
        opacity: 0,
        duration: MOTION.duration.slow,
        ease: MOTION.ease.reveal,
        scrollTrigger: {
          trigger: sectionEl,
          start: MOTION.trigger.standard,
          once: true,
        },
      });

      const layerEls = layersContainerEl.querySelectorAll<HTMLElement>("[data-layer-row]");

      if (layerEls.length > 0) {
        gsap.from(layerEls, {
          x: -MOTION.translate.md,
          opacity: 0,
          stagger: MOTION.stagger.layers,
          duration: MOTION.duration.slow,
          ease: MOTION.ease.reveal,
          scrollTrigger: {
            trigger: layersContainerEl,
            start: MOTION.trigger.standard,
            once: true,
          },
        });
      }

      const lineEls = layersContainerEl.querySelectorAll<HTMLElement>("[data-layer-line]");

      if (lineEls.length > 0) {
        lineEls.forEach((lineEl, index) => {
          const rowEl = lineEl.closest<HTMLElement>("[data-layer-row]");

          if (!rowEl) {
            return;
          }

          gsap.fromTo(
            lineEl,
            { scaleX: 0, transformOrigin: "left" },
            {
              scaleX: 1,
              duration: MOTION.duration.slow,
              delay: index * MOTION.stagger.lines,
              ease: MOTION.ease.reveal,
              scrollTrigger: {
                trigger: rowEl,
                start: MOTION.trigger.standard,
                once: true,
              },
            }
          );
        });
      }

      const numberEls = layersContainerEl.querySelectorAll<HTMLElement>("[data-layer-number]");

      if (numberEls.length > 0) {
        numberEls.forEach((numberEl) => {
          gsap.fromTo(
            numberEl,
            { opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: MOTION.duration.fast, ease: MOTION.ease.reveal },
                { opacity: 0.6, duration: MOTION.duration.fast, ease: MOTION.ease.reveal },
              ],
              immediateRender: false,
              scrollTrigger: {
                trigger: numberEl,
                start: MOTION.trigger.lazy,
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative z-10 min-h-screen scroll-mt-24 py-[clamp(80px,7.6vw+50px,180px)]"
      aria-labelledby="stack-heading"
    >
      <div aria-hidden="true" className="bg-dotmatrix pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 lg:px-16">
        <div ref={headerRef}>
          <p className="terminal-cursor mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
            {'// "ARCHITECTURE"'}
          </p>
          <h2 id="stack-heading" className="mb-4 font-heading text-3xl font-semibold text-ink">
            THE STACK
          </h2>
          <p className="mb-12 max-w-[60ch] text-base text-ink-dim">Building from bare metal to browser.</p>
        </div>

        <div ref={layersContainerRef} className="flex flex-col">
          {stackLayers.map((layer, index) => (
            <div
              key={layer.name}
              data-layer-row
              className="group relative flex flex-col items-start gap-6 border-b border-ink-faint/40 py-6 transition-colors duration-300 hover:bg-[rgba(232,228,222,0.02)] last:border-b-0 lg:flex-row"
            >
              <span
                data-layer-number
                className="min-w-[32px] pt-1 font-mono text-xs text-ink-dim opacity-60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="mb-1 font-heading text-xl font-semibold text-ink-dim transition-colors duration-300 group-hover:text-ink">
                  {layer.name}
                </h3>
                <p className="pt-1 font-mono text-sm text-ink-dim lg:hidden">
                  {layer.technologies.join(" · ")}
                </p>
                <p className="mt-1 text-sm text-ink-dim">{layer.description}</p>
              </div>

              <p className="hidden min-w-[260px] pt-1 text-right font-mono text-sm text-ink-dim lg:block">
                {layer.technologies.join(" · ")}
              </p>

              {index < stackLayers.length - 1 ? (
                <div
                  aria-hidden="true"
                  data-layer-line
                  className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-ink-dim/30"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SovereignStack;
