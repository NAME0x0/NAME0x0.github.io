"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { capabilities, languageDistribution, profile } from "@/lib/data/profile";
import { useGitHubPortfolioData } from "@/lib/hooks/useGitHubPortfolioData";

gsap.registerPlugin(ScrollTrigger);

const CONTRIBUTION_KEYS = ["contributions", "totalContributions", "commits", "totalCommits"] as const;
const STAR_KEYS = ["stars", "totalStars", "githubStars"] as const;

interface StatItem {
  label: string;
  value: string;
}

function parseStatNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function formatStatValue(value: number | string | null | undefined): string {
  if (typeof value === "number") {
    return `${value}`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "--";
}

function readNumericStat(
  source: Record<string, unknown> | null,
  keys: readonly string[]
): number | null {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const parsed = parseStatNumber(source[key] as number | string | null | undefined);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

export function About() {
  const { data } = useGitHubPortfolioData();
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const totalStars = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.repositories.reduce((sum, repo) => sum + repo.stars, 0);
  }, [data]);

  const profileStatsRecord = profile.stats as unknown as Record<string, unknown>;
  const dataProfileRecord = data?.profile
    ? (data.profile as unknown as Record<string, unknown>)
    : null;

  const contributionCount =
    readNumericStat(dataProfileRecord, CONTRIBUTION_KEYS) ??
    readNumericStat(profileStatsRecord, CONTRIBUTION_KEYS);

  const fallbackStars = readNumericStat(profileStatsRecord, STAR_KEYS);
  const reposValue = data?.profile.publicRepos ?? profile.stats.publicRepos ?? null;
  const sinceValue = data?.profile.memberSince ?? profile.stats.memberSince ?? null;
  const starsValue = data ? totalStars : fallbackStars;

  const stats = useMemo<StatItem[]>(
    () => [
      { label: "Repos", value: formatStatValue(reposValue) },
      { label: "Contributions", value: formatStatValue(contributionCount) },
      { label: "Stars", value: formatStatValue(starsValue) },
      { label: "Since", value: formatStatValue(sinceValue) },
    ],
    [contributionCount, reposValue, sinceValue, starsValue]
  );

  const maxLanguagePercentage = Math.max(
    ...languageDistribution.map((language) => language.percentage),
    0
  );

  const bioEntries: readonly string[] = Array.isArray(profile.bio) ? profile.bio : [profile.bio];

  const hasAnimatedRef = useRef(false);

  const setupAnimations = useCallback(() => {
    if (hasAnimatedRef.current) return;

    const sectionEl = sectionRef.current;
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    const statsEl = statsRef.current;
    const chartEl = chartRef.current;

    if (!sectionEl || !leftEl || !rightEl || !statsEl || !chartEl) {
      return;
    }

    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const barEls = chartEl.querySelectorAll<HTMLElement>("[data-lang-bar]");
      const statEls = statsEl.querySelectorAll<HTMLElement>("[data-stat-value]");
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([leftEl, rightEl], { x: 0, opacity: 1 });
        if (barEls.length > 0) {
          gsap.set(barEls, { scaleX: 1, transformOrigin: "left" });
        }
        return;
      }

      gsap.from(leftEl, {
        x: -25,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(rightEl, {
        x: 25,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          once: true,
        },
      });

      if (barEls.length > 0) {
        gsap.from(barEls, {
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: chartEl,
            start: "top 80%",
            once: true,
          },
        });
      }

      if (statEls.length > 0) {
        statEls.forEach((el, index) => {
          const target = Number.parseInt(el.textContent ?? "0", 10);
          if (Number.isNaN(target)) {
            return;
          }

          gsap.from(el, {
            textContent: 0,
            duration: 1.5,
            delay: index * 0.2,
            snap: { textContent: 1 },
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsEl,
              start: "top 80%",
              once: true,
            },
            onUpdate: () => {
              const current = Number.parseInt(el.textContent ?? "0", 10);
              if (!Number.isNaN(current)) {
                el.textContent = `${current}`;
              }
            },
          });
        });
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return setupAnimations();
  }, [setupAnimations, stats]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 py-[clamp(80px,7.6vw+50px,160px)]"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1.5fr_1fr]">
          <div ref={leftRef}>
            <p className="terminal-cursor mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
              // IDENTITY
            </p>
            <h2 id="about-heading" className="mb-2 font-heading text-3xl font-semibold text-ink">
              ABOUT
            </h2>

            <div className="mb-8 space-y-4">
              {bioEntries.map((entry, index) => (
                <p key={`${entry}-${index}`} className="font-body text-base leading-relaxed text-ink">
                  {entry}
                </p>
              ))}
            </div>

            <div className="mb-8">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
                CAPABILITIES
              </p>

              {capabilities.map((capability) => (
                <div key={capability.domain} className="mb-4">
                  <p className="mb-1 text-sm font-medium text-ink">{capability.domain}</p>
                  <p className="font-mono text-sm text-ink-dim">
                    {capability.skills.join(" \u00B7 ")}
                  </p>
                </div>
              ))}
            </div>

            <div className="font-mono text-sm leading-relaxed text-ink-dim">
              <p>{profile.location || "Dubai, UAE"}</p>
              <p>{profile.university || "BSc (Hons) IT \u2014 Middlesex University Dubai"}</p>
            </div>
          </div>

          <div ref={rightRef}>
            <div ref={statsRef} className="mb-10 grid grid-cols-2 gap-6">
              {stats.map((item) => (
                <div key={item.label} className="glass-card p-4">
                  <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink-dim">
                    {item.label}
                  </p>
                  <p data-stat-value className="font-heading text-xl font-semibold text-ink">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div ref={chartRef}>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
                LANGUAGES
              </p>

              {languageDistribution.map((language) => {
                const barWidth =
                  maxLanguagePercentage > 0
                    ? (language.percentage / maxLanguagePercentage) * 100
                    : 0;

                return (
                  <div key={language.name} className="mb-2.5 flex items-center gap-3">
                    <span className="min-w-[100px] text-right font-mono text-sm text-ink-dim">
                      {language.name}
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-ink-faint/20">
                      <div
                        data-lang-bar
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${barWidth}%`,
                          background: `linear-gradient(90deg, ${language.color}CC, ${language.color}66)`,
                        }}
                      />
                    </div>
                    <span className="min-w-[36px] font-mono text-sm text-ink-faint">
                      {language.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
