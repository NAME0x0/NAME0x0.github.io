"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data/profile";
import { MOTION } from "@/lib/motion/motionTokens";
import { smoothScrollTo } from "@/lib/navigation/scroll";

gsap.registerPlugin(ScrollTrigger);

const ROLE_TEXT = "Systems Architect \u00B7 AI Engineer \u00B7 OS Developer";
const NAME_GLOW_START = "0 0 40px rgba(232, 228, 222, 0.15)";
const NAME_GLOW_END = "0 0 60px rgba(232, 228, 222, 0.08)";

export function Hero() {
  const displayName = profile.name.toUpperCase();
  const summaryText = Array.isArray(profile.bio) ? profile.bio[0] : profile.bio;
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    smoothScrollTo(sectionId);
  }, []);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current;
      const nameEl = nameRef.current;
      const roleEl = roleRef.current;
      const summaryEl = summaryRef.current;
      const actionsEl = actionsRef.current;
      const scrollCueEl = scrollCueRef.current;
      const contentEl = contentRef.current;
      const scrollCueInnerEl = scrollCueEl?.firstElementChild as HTMLDivElement | null;
      const nameCharEls = nameEl
        ? Array.from(nameEl.querySelectorAll<HTMLSpanElement>("[data-hero-char]"))
        : [];

      if (
        !sectionEl ||
        !nameEl ||
        !roleEl ||
        !summaryEl ||
        !actionsEl ||
        !scrollCueEl ||
        !scrollCueInnerEl ||
        !contentEl
      ) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

      if (prefersReducedMotion) {
        gsap.set(nameCharEls, { y: 0, opacity: 1 });
        gsap.set(nameEl, { opacity: 1, y: 0, scale: 1, textShadow: NAME_GLOW_START });
        gsap.set(roleEl, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" });
        gsap.set(summaryEl, { opacity: 1, y: 0 });
        gsap.set(actionsEl, { opacity: 1, y: 0 });
        gsap.set(scrollCueEl, { opacity: 0.5, y: 0 });
        gsap.set(scrollCueInnerEl, { y: 0 });
        return;
      }

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

      gsap.set(nameCharEls, { opacity: 0 });
      gsap.set(nameEl, { textShadow: NAME_GLOW_START });
      gsap.set(roleEl, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(summaryEl, { opacity: 0, y: 12 });
      gsap.set(actionsEl, { opacity: 0, y: 12 });
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
        duration: MOTION.duration.fast,
        stagger: MOTION.stagger.chars,
        delay: 0.2,
        ease: MOTION.ease.reveal,
      });
      introTimeline.add(() => {
        nameGlowTween.play();
      }, ">");
      introTimeline.to(
        roleEl,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: MOTION.duration.normal,
          ease: MOTION.ease.indicator,
        },
        ">+0.3"
      );
      introTimeline.to(
        scrollCueEl,
        {
          opacity: 0.8,
          duration: MOTION.duration.normal,
          ease: MOTION.ease.reveal,
        },
        ">+0.4"
      );
      introTimeline.to(
        summaryEl,
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.normal,
          ease: MOTION.ease.reveal,
        },
        "<+0.1"
      );
      introTimeline.to(
        actionsEl,
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.normal,
          ease: MOTION.ease.reveal,
        },
        "<+0.05"
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
          .fromTo(nameEl, { y: "0%", opacity: 1, scale: 1 }, { y: "-20%", opacity: 0, scale: 0.98, ease: "none" }, 0)
          .fromTo(roleEl, { y: "0%", opacity: 1 }, { y: "-12%", opacity: 0, ease: "none" }, 0)
          .fromTo(summaryEl, { y: "0%", opacity: 1 }, { y: "-8%", opacity: 0, ease: "none" }, 0)
          .fromTo(actionsEl, { y: "0%", opacity: 1 }, { y: "-8%", opacity: 0, ease: "none" }, 0)
          .fromTo(scrollCueEl, { opacity: 0.8, y: 0 }, { opacity: 0, y: -8, ease: "none" }, 0),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction"
      className="relative z-10 flex h-screen min-h-[600px] scroll-mt-24 flex-col items-center justify-center bg-transparent px-6"
    >
      {/* HUD Background Details */}
      <div className="pointer-events-none absolute inset-4 border border-ink-faint/30 m-4 sm:m-8 lg:m-12">
        <div className="absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t border-ink-dim/50" />
        <div className="absolute -right-[1px] -top-[1px] h-2 w-2 border-r border-t border-ink-dim/50" />
        <div className="absolute -bottom-[1px] -left-[1px] h-2 w-2 border-b border-l border-ink-dim/50" />
        <div className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b border-r border-ink-dim/50" />
        <div className="text-halo-sm absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-ink-dim/70">
          SYS.INIT // SOVEREIGN_ARCHITECT
        </div>
        <div className="text-halo-sm absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-ink-dim/70">
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
          className="text-halo-sm mt-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim"
        >
          {ROLE_TEXT}
        </p>
        <p ref={summaryRef} className="text-halo-sm mt-5 max-w-[760px] text-balance text-sm text-ink-dim sm:text-base">
          {summaryText}
        </p>
        <div ref={actionsRef} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, "projects")}
            className="text-halo-sm inline-flex items-center border border-ink/40 bg-void/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-void hover:[text-shadow:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            View Work
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, "contact")}
            className="text-halo-sm inline-flex items-center border border-ink-faint/60 bg-void/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-dim backdrop-blur-sm transition-colors duration-300 hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Start Conversation
          </a>
        </div>
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
