"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileIdentity } from "@/lib/data/curated";

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
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from([emailEl, socialsEl], {
        y: 15,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(dividerEl, {
        scaleX: 0,
        transformOrigin: "center",
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 80%",
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
      className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-6 pt-[120px] pb-[60px] text-center"
      aria-labelledby="contact-heading"
    >
      <p className="terminal-cursor mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
        // UPLINK
      </p>
      <h2
        ref={headingRef}
        id="contact-heading"
        className="mb-6 font-heading text-3xl font-semibold text-ink"
      >
        LET&apos;S BUILD
      </h2>

      <a
        ref={emailRef}
        href={`mailto:${email}`}
        className="link-hover mb-4 inline-block font-body text-base text-accent transition-all duration-300 hover:[text-shadow:0_0_20px_rgba(196,181,160,0.3)]"
        aria-label="Send email to Muhammad Afsah Mumtaz"
      >
        {email}
      </a>

      <p ref={socialsRef} className="mb-12 font-mono text-sm text-ink-dim">
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

      <div ref={dividerRef} className="mx-auto mb-6 h-px w-[200px] bg-ink-faint" />
      <p className="font-mono text-sm text-ink-faint">&copy; 2026 Muhammad Afsah Mumtaz</p>
    </footer>
  );
}

export default Contact;
