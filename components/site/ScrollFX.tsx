"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

const sectionIntertitles: Record<string, string> = {
  metal: "02 — METAL",
  voice: "03 — VOICE",
  mind: "04 — PROOF",
  council: "05 — COUNCIL",
  blueprint: "06 — BLUEPRINT",
  light: "07 — LIGHT",
  human: "08 — HUMAN",
};

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
      const splits = new Set<SplitText>();
      const createdElements: HTMLElement[] = [];
      const skeletonObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const section = entry.target as HTMLElement;
            const container = section.querySelector<HTMLElement>(":scope > div");

            skeletonObserver.unobserve(section);

            if (!container) {
              return;
            }

            const overlay = document.createElement("div");
            const isPaper = section.id === "human";

            overlay.setAttribute("aria-hidden", "true");
            overlay.textContent = "▒ ".repeat(420);
            Object.assign(overlay.style, {
              position: "absolute",
              inset: "0",
              zIndex: "60",
              overflow: "hidden",
              pointerEvents: "none",
              color: isPaper ? "rgba(28, 26, 23, 0.1)" : "rgba(196, 181, 160, 0.18)",
              background: isPaper
                ? "linear-gradient(105deg, rgba(28, 26, 23, 0), rgba(28, 26, 23, 0.08), rgba(28, 26, 23, 0))"
                : "linear-gradient(105deg, rgba(196, 181, 160, 0), rgba(196, 181, 160, 0.14), rgba(196, 181, 160, 0))",
              backgroundSize: "220% 100%",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "13px",
              letterSpacing: "0.18em",
              lineHeight: "1.6",
              opacity: "0",
            });
            container.appendChild(overlay);
            createdElements.push(overlay);
            gsap.timeline({
              onComplete: () => {
                overlay.remove();
              },
            })
              .to(overlay, { opacity: 1, backgroundPosition: "100% 0", duration: 0.08, ease: "power1.out" })
              .to(overlay, { opacity: 0, duration: 0.14, ease: "power1.out" });
          });
        },
        { rootMargin: "0px 0px 45% 0px", threshold: 0 },
      );
      const ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>("main#main > section[id]").forEach((section) => {
          if (section.id !== "ignition") {
            skeletonObserver.observe(section);
          }

          const label = sectionIntertitles[section.id];

          if (!label) {
            return;
          }

          const intertitle = document.createElement("div");
          const isPaper = section.id === "human";

          intertitle.setAttribute("aria-hidden", "true");
          intertitle.textContent = label;
          Object.assign(intertitle.style, {
            position: "absolute",
            top: "clamp(2rem, 8vw, 6rem)",
            left: "6vw",
            zIndex: "2",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            color: isPaper ? "rgba(28, 26, 23, 0.14)" : "rgba(232, 228, 222, 0.12)",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontSize: "clamp(3rem, 11vw, 9.5rem)",
            fontWeight: "700",
            lineHeight: "0.82",
            opacity: "0",
          });
          section.appendChild(intertitle);
          createdElements.push(intertitle);
          gsap.timeline({
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
          })
            .fromTo(intertitle, { x: "6vw", opacity: 0 }, { x: "0vw", opacity: 1, duration: 0.55, ease: "power3.out" })
            .to(intertitle, { opacity: 1, duration: 0.6 })
            .to(intertitle, { opacity: 0, duration: 0.4, ease: "power2.out" });
        });

        document.querySelectorAll<HTMLElement>("[data-reveal='lines']").forEach((element) => {
          const split = new SplitText(element, {
            type: "lines",
            linesClass: "split-line",
            mask: "lines",
          } as SplitText.Vars);
          const isHero = element.hasAttribute("data-hero-lockup");

          splits.add(split);
          gsap.set(split.lines, { yPercent: 110, paddingBlock: "0.12em", marginBlock: "-0.12em" });
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.08,
            delay: isHero ? 0.15 : 0,
            scrollTrigger: isHero ? undefined : { trigger: element, start: "top 82%", once: true },
            onComplete: () => {
              split.revert();
              splits.delete(split);
            },
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
        skeletonObserver.disconnect();
        splits.forEach((split) => split.revert());
        createdElements.forEach((element) => element.remove());
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
