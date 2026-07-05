"use client";

import { useEffect } from "react";
import { TERMINAL_EVENT } from "@/components/site/Terminal";

const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function Konami() {
  useEffect(() => {
    let index = 0;
    let timer = 0;

    const clearKonami = () => {
      delete document.body.dataset.konami;
      timer = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key !== sequence[index]) {
        index = key === sequence[0] ? 1 : 0;
        return;
      }

      index += 1;

      if (index < sequence.length) {
        return;
      }

      index = 0;
      document.body.dataset.konami = "on";
      window.dispatchEvent(new CustomEvent(TERMINAL_EVENT, { detail: "konami acknowledged. the machine sees you." }));

      if (timer !== 0) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(clearKonami, 4000);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);

      if (timer !== 0) {
        window.clearTimeout(timer);
      }

      delete document.body.dataset.konami;
    };
  }, []);

  return null;
}
