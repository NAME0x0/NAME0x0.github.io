"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export const CHAPTER_SECTION_IDS = [
  "ignition",
  "metal",
  "voice",
  "mind",
  "council",
  "blueprint",
  "light",
  "human",
] as const;

export type ChapterId = (typeof CHAPTER_SECTION_IDS)[number];

export type FilmProgress = {
  p: number;
  chapter: number;
  chapterLocal: number;
};

type Listener = (progress: FilmProgress) => void;

type ChapterBand = {
  top: number;
  height: number;
};

const initialProgress: FilmProgress = {
  p: 0,
  chapter: 0,
  chapterLocal: 0,
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function createFilmProgressStore() {
  let snapshot = initialProgress;
  const listeners = new Set<Listener>();

  return {
    getSnapshot() {
      return snapshot;
    },
    setSnapshot(next: FilmProgress) {
      if (
        next.p === snapshot.p &&
        next.chapter === snapshot.chapter &&
        next.chapterLocal === snapshot.chapterLocal
      ) {
        return;
      }

      snapshot = next;
      listeners.forEach((listener) => listener(snapshot));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(snapshot);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const filmProgressStore = createFilmProgressStore();

export function useFilmProgress() {
  return filmProgressStore;
}

export function useFilmProgressEngine() {
  useEffect(() => {
    let disposed = false;
    let rafId = 0;
    let scrollRafId = 0;
    let resizeRafId = 0;
    let bands: ChapterBand[] = [];

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
    });

    const measure = () => {
      bands = CHAPTER_SECTION_IDS.map((id) => {
        const element = document.getElementById(id);

        return {
          top: element?.offsetTop ?? 0,
          height: Math.max(element?.offsetHeight ?? window.innerHeight, 1),
        };
      });
    };

    const update = () => {
      scrollRafId = 0;

      const viewport = Math.max(window.innerHeight, 1);
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - viewport, 1);
      const probeY = scrollY + viewport * 0.5;
      let chapter = 0;

      for (let index = 0; index < bands.length; index += 1) {
        const band = bands[index];

        if (probeY >= band.top) {
          chapter = index;
        }
      }

      const activeBand = bands[chapter] ?? { top: 0, height: viewport };
      const chapterLocal = clamp01((probeY - activeBand.top) / activeBand.height);

      filmProgressStore.setSnapshot({
        p: clamp01(scrollY / maxScroll),
        chapter,
        chapterLocal,
      });
    };

    const scheduleUpdate = () => {
      if (scrollRafId !== 0) {
        return;
      }

      scrollRafId = window.requestAnimationFrame(update);
    };

    const scheduleMeasure = () => {
      if (resizeRafId !== 0) {
        return;
      }

      resizeRafId = window.requestAnimationFrame(() => {
        resizeRafId = 0;
        measure();
        scheduleUpdate();
      });
    };

    const raf = (time: number) => {
      if (disposed) {
        return;
      }

      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    measure();
    update();
    rafId = window.requestAnimationFrame(raf);

    const unsubscribeScroll = lenis.on("scroll", scheduleUpdate);
    window.addEventListener("resize", scheduleMeasure);

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(document.body);

    return () => {
      disposed = true;
      unsubscribeScroll();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(scrollRafId);
      window.cancelAnimationFrame(resizeRafId);
      lenis.destroy();
      filmProgressStore.setSnapshot(initialProgress);
    };
  }, []);
}
