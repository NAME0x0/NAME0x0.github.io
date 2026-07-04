"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { checkFilmGate } from "@/lib/film/gate";

const FilmCanvas = dynamic(() => import("./FilmCanvas").then((module) => module.FilmCanvas), {
  ssr: false,
});

export function FilmMount() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkGate() {
      if (!cancelled && (await checkFilmGate())) {
        setEnabled(true);
      }
    }

    void checkGate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    document.body.dataset.film = "on";

    return () => {
      delete document.body.dataset.film;
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <FilmCanvas />;
}
