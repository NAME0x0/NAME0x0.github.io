"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data/profile";

gsap.registerPlugin(ScrollTrigger);

const ROLE_TEXT = "Systems Architect \u00B7 AI Engineer \u00B7 OS Developer";
const NAME_GLOW_START = "0 0 40px rgba(232, 228, 222, 0.15)";
const NAME_GLOW_END = "0 0 60px rgba(232, 228, 222, 0.08)";

export function Hero() {
  const displayName = profile.name.toUpperCase();
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current;
      const nameEl = nameRef.current;
      const roleEl = roleRef.current;
      const scrollCueEl = scrollCueRef.current;
      const contentEl = contentRef.current;
      const scrollCueInnerEl = scrollCueEl?.firstElementChild as HTMLDivElement | null;
      const nameCharEls = nameEl
        ? Array.from(nameEl.querySelectorAll<HTMLSpanElement>("[data-hero-char]"))
        : [];

      if (!sectionEl || !nameEl || !roleEl || !scrollCueEl || !scrollCueInnerEl || !contentEl) {
        return;
      }

      const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

      // Decode Effect using GSAP
      nameCharEls.forEach((charEl, i) => {
        const originalText = charEl.dataset.original || charEl.textContent || "";
        if (originalText === "\u00A0") return;

        gsap.to(charEl, {
          duration: 1.5,
          delay: 0.15 + (i * 0.05),
          onUpdate: function () {
            const progress = this.progress();
            if (progress < 1) {
              // Determine a random scrambling length ratio
              const ratio = Math.random() < Math.max(0, 1 - progress * 1.5) ? 1 : 0;

              if (ratio > 0) {
                charEl.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
                charEl.style.opacity = "0.7";
              } else {
                charEl.textContent = originalText;
                charEl.style.opacity = "1";
              }
            } else {
              charEl.textContent = originalText;
              charEl.style.opacity = "1";
            }
          }
        });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(nameCharEls, { y: 0, opacity: 1 });
        gsap.set(nameEl, { opacity: 1, y: 0, scale: 1, textShadow: NAME_GLOW_START });
        gsap.set(roleEl, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" });
        gsap.set(scrollCueEl, { opacity: 0.5, y: 0 });
        gsap.set(scrollCueInnerEl, { y: 0 });
        return;
      }

      gsap.set(nameCharEls, { opacity: 0 });
      gsap.set(nameEl, { textShadow: NAME_GLOW_START });
      gsap.set(roleEl, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(scrollCueEl, { opacity: 0 });
      gsap.set(scrollCueInnerEl, { opacity: 1 });

      const nameGlowTween = gsap.to(nameEl, {
        textShadow: NAME_GLOW_END,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      const scrollCueBlinkTween = gsap.to(scrollCueInnerEl, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "steps(1)",
        paused: true,
      });

      const introTimeline = gsap.timeline();

      introTimeline.to(nameCharEls, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.06,
        delay: 0.2,
        ease: "power2.out",
      });
      introTimeline.add(() => {
        nameGlowTween.play();
      }, ">");
      introTimeline.to(
        roleEl,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power3.out",
        },
        ">+0.3"
      );
      introTimeline.to(
        scrollCueEl,
        {
          opacity: 0.8,
          duration: 0.6,
          ease: "power2.out",
        },
        ">+0.4"
      );
      introTimeline.add(() => {
        scrollCueBlinkTween.play();
      }, ">");

      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap
          .timeline()
          .to(nameEl, { y: "-20%", opacity: 0, scale: 0.98, ease: "none" }, 0)
          .to(roleEl, { y: "-12%", opacity: 0, ease: "none" }, 0)
          .to(scrollCueEl, { opacity: 0, y: -8, ease: "none" }, 0),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="relative z-10 flex h-screen min-h-[600px] flex-col items-center justify-center bg-transparent px-6"
    >
      {/* HUD Background Details */}
      <div className="pointer-events-none absolute inset-4 border border-ink-faint/30 m-4 sm:m-8 lg:m-12">
        <div className="absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t border-ink-dim/50" />
        <div className="absolute -right-[1px] -top-[1px] h-2 w-2 border-r border-t border-ink-dim/50" />
        <div className="absolute -bottom-[1px] -left-[1px] h-2 w-2 border-b border-l border-ink-dim/50" />
        <div className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b border-r border-ink-dim/50" />
        <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-ink-faint/80">
          SYS.INIT // SOVEREIGN_ARCHITECT
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest text-ink-faint/80">
          SECURE ENCLAVE ACTIVE
        </div>
      </div>

      <div ref={contentRef} className="flex flex-col items-center justify-center text-center">
        {/* Kinetic Wall renders behind via SceneContainer — text floats above */}
        <h1
          ref={nameRef}
          className="font-heading text-display font-bold tracking-[-0.05em] text-ink"
          aria-label={displayName}
        >
          {displayName.split("").map((char, index) => (
            <span key={`${char}-${index}`} className="inline-block overflow-hidden align-top">
              <span data-hero-char data-original={char === " " ? "\u00A0" : char} aria-hidden="true" className="inline-block">
                {char === " " ? "\u00A0" : ""}
              </span>
            </span>
          ))}
        </h1>
        <p
          ref={roleRef}
          className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim"
        >
          {ROLE_TEXT}
        </p>
      </div>
      <div
        ref={scrollCueRef}
        aria-hidden="true"
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
          AWAITING_INPUT
        </span>
        <div className="h-4 w-[6px] bg-ink-dim" />
      </div>
    </section>
  );
}

export default Hero;
