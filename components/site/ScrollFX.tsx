"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

function parseLeadingNumber(value: string) {
  const match = value.match(/^~?\d[\d,]*\.?\d*/);

  if (!match) {
    return null;
  }

  const raw = match[0];
  const numeric = Number(raw.replace("~", "").replaceAll(",", ""));

  if (!Number.isFinite(numeric)) {
    return null;
  }

  const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;

  return { raw, numeric, decimals, suffix: value.slice(raw.length) };
}

export function ScrollFX() {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      registered = true;
    }

    const mm = gsap.matchMedia();
    const refresh = () => ScrollTrigger.refresh();
    const fontRefresh = () => {
      document.fonts?.ready.then(refresh).catch(() => undefined);
    };
    const observer = new MutationObserver(refresh);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>("[data-reveal='lines']").forEach((element) => {
          const split = new SplitText(element, {
            type: "lines",
            linesClass: "split-line",
            mask: "lines",
          } as SplitText.Vars);
          const isHero = element.hasAttribute("data-hero-lockup");

          splits.push(split);
          gsap.set(split.lines, { yPercent: 110 });
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.08,
            delay: isHero ? 0.15 : 0,
            scrollTrigger: isHero ? undefined : { trigger: element, start: "top 82%", once: true },
          });
        });

        document.querySelectorAll<HTMLElement>("[data-reveal='overline']").forEach((element) => {
          gsap.set(element, { x: -16, opacity: 0 });
          gsap.to(element, {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          });

          const rule = element.querySelector<HTMLElement>("[data-reveal-rule]");

          if (rule) {
            gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
            gsap.to(rule, {
              scaleX: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            });
          }
        });

        const rowParents = new Set<HTMLElement>();

        document.querySelectorAll<HTMLElement>("[data-reveal='row']").forEach((row) => {
          rowParents.add(row.parentElement ?? row);
        });

        rowParents.forEach((parent) => {
          const rows = Array.from(parent.querySelectorAll<HTMLElement>("[data-reveal='row']"));

          gsap.set(rows, { y: 14, opacity: 0 });
          gsap.to(rows, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: { trigger: parent, start: "top 88%", once: true },
          });
        });

        document.querySelectorAll<HTMLElement>("[data-countup][data-value]").forEach((element) => {
          const value = element.dataset.value ?? "";
          const parsed = parseLeadingNumber(value);

          if (!parsed) {
            return;
          }

          const state = { value: 0 };

          ScrollTrigger.create({
            trigger: element,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(state, {
                value: parsed.numeric,
                duration: 1.15,
                ease: "power2.out",
                onUpdate: () => {
                  element.textContent = `${state.value.toFixed(parsed.decimals)}${parsed.suffix}`;
                },
                onComplete: () => {
                  element.textContent = value;
                },
              });
            },
          });
        });

        document.querySelectorAll<HTMLElement>("[data-parallax='soft']").forEach((element) => {
          gsap.to(element, {
            y: -10,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        document.querySelectorAll<HTMLElement>("section > div, section > article").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 12 },
            {
              y: -12,
              ease: "none",
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        document.querySelectorAll<HTMLElement>("[data-ghost-numeral]").forEach((element) => {
          const section = element.closest("section") ?? element;

          gsap.fromTo(
            element,
            { y: 60 },
            {
              y: -60,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      fontRefresh();
      observer.observe(document.body, { attributes: true, attributeFilter: ["data-film"] });
      window.addEventListener("resize", refresh);

      return () => {
        window.removeEventListener("resize", refresh);
        observer.disconnect();
        splits.forEach((split) => split.revert());
        ctx.revert();
      };
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
