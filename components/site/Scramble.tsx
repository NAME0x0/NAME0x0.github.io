"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET = "!<>-_\\/[]{}=+*^?#01";

type ScrambleProps = {
  children: string;
};

function canAnimate() {
  return (
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function Scramble({ children }: ScrambleProps) {
  const [label, setLabel] = useState(children);
  const frameRef = useRef(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    setLabel(children);
  }, [children]);

  useEffect(() => () => {
    window.cancelAnimationFrame(frameRef.current);
  }, []);

  function decode() {
    if (!canAnimate()) {
      return;
    }

    window.cancelAnimationFrame(frameRef.current);
    startedAtRef.current = performance.now();

    const tick = (time: number) => {
      const elapsed = time - startedAtRef.current;
      const progress = Math.min(1, elapsed / 220);
      const fixed = Math.floor(progress * children.length);
      let next = "";

      for (let index = 0; index < children.length; index += 1) {
        if (index < fixed || children[index] === " ") {
          next += children[index];
        } else {
          next += CHARSET[(index * 7 + Math.floor(time / 18)) % CHARSET.length];
        }
      }

      setLabel(progress >= 1 ? children : next);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }

  return (
    <span aria-label={children} onMouseEnter={decode}>
      <span aria-hidden="true" className="font-mono">{label}</span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
