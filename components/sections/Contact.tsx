"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileIdentity } from "@/lib/data/curated";
import { MOTION } from "@/lib/motion/motionTokens";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_EMAIL = "m.afsah.279@gmail.com";
const FALLBACK_GITHUB = "https://github.com/NAME0x0";
const FALLBACK_LINKEDIN = "https://linkedin.com/in/afsah-mumtaz";
const FALLBACK_TWITTER = "https://x.com/NAME0x0";

function resolveValue(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback;
}

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  const socialsRef = useRef<HTMLParagraphElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  const email = resolveValue(profileIdentity.email, FALLBACK_EMAIL);
  const githubHref = resolveValue(profileIdentity.socials?.github, FALLBACK_GITHUB);
  const linkedInHref = resolveValue(profileIdentity.socials?.linkedin, FALLBACK_LINKEDIN);
  const twitterHref = resolveValue(profileIdentity.socials?.twitter, FALLBACK_TWITTER);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const headingEl = headingRef.current;
    const emailEl = emailRef.current;
    const socialsEl = socialsRef.current;
    const dividerEl = dividerRef.current;

    if (!sectionEl || !headingEl || !emailEl || !socialsEl || !dividerEl) {
      return;
    }

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([headingEl, emailEl, socialsEl], { scale: 1, y: 0, opacity: 1 });
        gsap.set(dividerEl, { scaleX: 1, transformOrigin: "center" });
        return;
      }

      gsap.from(headingEl, {
        scale: 0.97,
        opacity: 0,
        duration: MOTION.duration.slow,
        ease: MOTION.ease.indicator,
        scrollTrigger: {
          trigger: sectionEl,
          start: MOTION.trigger.standard,
          once: true,
        },
      });

      gsap.from([emailEl, socialsEl], {
        y: MOTION.translate.md,
        opacity: 0,
        stagger: MOTION.stagger.stats,
        duration: MOTION.duration.normal,
        ease: MOTION.ease.reveal,
        scrollTrigger: {
          trigger: sectionEl,
          start: MOTION.trigger.standard,
          once: true,
        },
      });

      gsap.from(dividerEl, {
        scaleX: 0,
        transformOrigin: "center",
        duration: MOTION.duration.slow,
        ease: MOTION.ease.reveal,
        scrollTrigger: {
          trigger: sectionEl,
          start: MOTION.trigger.standard,
          once: true,
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      role="contentinfo"
      className="relative z-10 flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 pt-[120px] pb-[60px] text-center"
      aria-labelledby="contact-heading"
    >
      {/* Dark vignette behind content for readability over wave surface */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 70%)" }}
      />
      <div className="relative flex flex-col items-center">
        <p className="terminal-cursor mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
          {"// UPLINK"}
        </p>
        <h2
          ref={headingRef}
          id="contact-heading"
          className="text-halo mb-6 font-heading text-3xl font-semibold text-ink"
        >
          LET&apos;S BUILD
        </h2>

        <a
          ref={emailRef}
          href={`mailto:${email}`}
          className="text-halo-sm link-hover mb-4 inline-block font-body text-base text-accent transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(196,181,160,0.3)]"
          aria-label="Send email to Muhammad Afsah Mumtaz"
        >
          {email}
        </a>

        <p ref={socialsRef} className="text-halo-sm mb-12 font-mono text-sm text-ink-dim">
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:-translate-y-px hover:text-ink"
          >
            GitHub
          </a>
          <span aria-hidden="true"> &middot; </span>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:-translate-y-px hover:text-ink"
          >
            LinkedIn
          </a>
          <span aria-hidden="true"> &middot; </span>
          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:-translate-y-px hover:text-ink"
          >
            Twitter
          </a>
        </p>

        <div ref={dividerRef} className="mx-auto mb-6 h-px w-[200px] bg-ink-dim/40" />
        <p className="text-halo-sm font-mono text-sm text-ink-dim/80">&copy; 2026 Muhammad Afsah Mumtaz</p>
      </div>
    </footer>
  );
}

export default Contact;
