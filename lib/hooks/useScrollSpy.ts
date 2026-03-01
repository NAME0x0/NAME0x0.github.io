import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollSpy(sectionIds: string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) {
      return;
    }

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) {
          return;
        }

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActive(id),
            onEnterBack: () => setActive(id),
          })
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, [sectionIds]);

  return active;
}

export default useScrollSpy;
