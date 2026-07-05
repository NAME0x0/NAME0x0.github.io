"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyVisibleProps = {
  children: ReactNode;
  /** Reserve space so nothing shifts when the real content mounts (CLS = 0). */
  minHeight?: string;
  /** How far ahead of the viewport to start mounting. */
  rootMargin?: string;
};

/**
 * Renders its children only once the placeholder nears the viewport. The child
 * (a client component like the terminal) is passed as an already-created element
 * but is not mounted — and therefore not hydrated — until then, which keeps its
 * hydration cost out of the initial load window (mobile Total Blocking Time).
 * A reserved min-height prevents layout shift.
 */
export function LazyVisible({ children, minHeight = "22rem", rootMargin = "300px" }: LazyVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      return undefined;
    }

    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return <div ref={ref}>{visible ? children : <div style={{ minHeight }} aria-hidden="true" />}</div>;
}
