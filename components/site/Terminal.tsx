"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Identity, Project, ProjectMetric } from "@/lib/content/schema";

type TerminalProject = Pick<Project, "slug" | "name" | "status" | "tagline" | "tier" | "links"> & {
  metrics: ProjectMetric[];
};

type TerminalIdentity = Pick<Identity, "name" | "handle" | "role" | "location">;

type TerminalProps = {
  identity: TerminalIdentity;
  projects: TerminalProject[];
};

type Tone = "normal" | "dim" | "signal" | "error" | "bone";

type TerminalLine = {
  text: string;
  tone?: Tone;
  href?: string;
  hrefLabel?: string;
  image?: string;
  imageAlt?: string;
};

type OutputBlock = {
  id: number;
  command?: string;
  lines: TerminalLine[];
};

const MAX_LINES = 200;
const TERMINAL_EVENT = "terminal:line";
const hints = [
  "try: whoami",
  "try: help",
  "try: ls",
  "try: neofetch",
  "try: vram",
  "try: sudo make me a sandwich",
];

const helpLines: TerminalLine[] = [
  { text: "help                 list every command" },
  { text: "whoami               print identity and current role" },
  { text: "ls                   list project slugs, tier 1 first" },
  { text: "cat <slug>           show project name, status, tagline, and repo" },
  { text: "open <slug>          tier 1 opens /work/<slug>; tier 2 opens the repo" },
  { text: "sudo hire-me         escalate to the CV" },
  { text: "vram                 print a 4 GB pressure gauge" },
  { text: "matrix               run an eight-second mono rain" },
  { text: "sudo <anything>      try the obvious mistake" },
  { text: "rm -rf /             request catastrophic restraint" },
  { text: "rm -rf /*            same refusal, different slash" },
  { text: "trackmania           run the racing line" },
  { text: "clear                clear scrollback" },
  { text: "exit                 blur the prompt" },
  { text: "neofetch             print machine trivia" },
];

function toneClass(tone: Tone = "normal") {
  switch (tone) {
    case "bone":
      return "text-bone";
    case "dim":
      return "text-dim";
    case "error":
      return "text-ember";
    case "signal":
      return "text-signal";
    default:
      return "text-ink";
  }
}

function countLines(block: OutputBlock) {
  return (block.command ? 1 : 0) + block.lines.length;
}

function capBlocks(blocks: OutputBlock[]) {
  let lineCount = 0;
  const kept: OutputBlock[] = [];

  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index];
    const nextCount = countLines(block);

    if (kept.length > 0 && lineCount + nextCount > MAX_LINES) {
      break;
    }

    kept.unshift(block);
    lineCount += nextCount;
  }

  return kept;
}

function findArcChallengeMetric(metrics: ProjectMetric[]) {
  return metrics.find((metric) => metric.verified && metric.label === "ARC-Challenge");
}

function renderLinkedText(line: TerminalLine) {
  const label = line.hrefLabel ?? line.href;

  if (!line.href || !label || !line.text.includes(label)) {
    return line.text;
  }

  const [before, after] = line.text.split(label);

  return (
    <>
      {before}
      <a href={line.href} className="underline decoration-bone/40 underline-offset-4 hover:text-bone">
        {label}
      </a>
      {after}
    </>
  );
}

function vramMeter(frame: number) {
  const progress = Math.min(1, frame / 15);
  const used = 0.31 * progress;
  const filled = Math.round(progress * 4);

  return `[${"#".repeat(filled)}${"-".repeat(16 - filled)}] ${used.toFixed(2)} / 4.00 GB`;
}

function rainLine(frame: number) {
  const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$+-";

  return Array.from({ length: 52 }, (_, index) => glyphs[(frame * 17 + index * 11) % glyphs.length]).join("");
}

function trackFrame(frame: number) {
  const width = 28;
  const position = Math.min(width - 1, Math.round((frame / 18) * (width - 1)));
  const line = `${" ".repeat(position)}> ${".".repeat(Math.max(width - position - 2, 0))}`;

  return [
    "/==============================\\",
    `|${line.padEnd(width, " ")}|`,
    "\\_____ apex ____ exit _________/",
  ];
}

export function Terminal({ identity, projects }: TerminalProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const animationTimersRef = useRef<number[]>([]);
  const reducedMotionRef = useRef(false);
  const idleHintPlayedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const [blocks, setBlocks] = useState<OutputBlock[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [hasTyped, setHasTyped] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const sortedProjects = useMemo(
    () => [...projects].sort((left, right) => left.tier - right.tier),
    [projects],
  );
  const projectsBySlug = useMemo(
    () => new Map(projects.map((project) => [project.slug, project])),
    [projects],
  );
  const avaMetric = useMemo(() => {
    const ava = projectsBySlug.get("ava");

    return ava ? findArcChallengeMetric(ava.metrics) : undefined;
  }, [projectsBySlug]);

  const pushBlock = (block: Omit<OutputBlock, "id">) => {
    setBlocks((current) => capBlocks([...current, { ...block, id: nextIdRef.current }]));
    nextIdRef.current += 1;
  };

  const schedule = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);

    animationTimersRef.current.push(timer);
  };

  const blurInput = () => {
    inputRef.current?.blur();
  };

  const markInteraction = () => {
    hasInteractedRef.current = true;

    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const runVram = (command: string) => {
    pushBlock({ command, lines: [{ text: vramMeter(0), tone: "signal" }] });

    for (let frame = 1; frame <= 15; frame += 1) {
      schedule(() => {
        pushBlock({
          lines: [
            { text: vramMeter(frame), tone: "signal" },
            ...(frame === 15 ? [{ text: "this site knows the feeling.", tone: "dim" as Tone }] : []),
          ],
        });
      }, frame * 100);
    }
  };

  const runMatrix = (command: string) => {
    if (reducedMotionRef.current) {
      pushBlock({ command, lines: [{ text: "no rain today.", tone: "dim" }] });
      return;
    }

    pushBlock({ command, lines: [{ text: "stream opened.", tone: "signal" }] });

    for (let frame = 1; frame <= 16; frame += 1) {
      schedule(() => {
        pushBlock({
          lines: [
            { text: rainLine(frame), tone: "signal" },
            ...(frame === 16 ? [{ text: "wake up, recruiter.", tone: "bone" as Tone }] : []),
          ],
        });
      }, frame * 500);
    }
  };

  const runTrackmania = (command: string) => {
    pushBlock({ command, lines: trackFrame(0).map((text) => ({ text, tone: "bone" as Tone })) });

    for (let frame = 1; frame <= 18; frame += 1) {
      schedule(() => {
        pushBlock({
          lines: [
            ...trackFrame(frame).map((text) => ({ text, tone: "bone" as Tone })),
            ...(frame === 18 ? [{ text: "improvement has no finish line.", tone: "signal" as Tone }] : []),
          ],
        });
      }, frame * 166);
    }
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    const lower = command.toLowerCase();

    if (!command) {
      return;
    }

    if (lower === "clear") {
      setBlocks([]);
      return;
    }

    if (lower === "vram") {
      runVram(command);
      return;
    }

    if (lower === "matrix") {
      runMatrix(command);
      return;
    }

    if (lower === "trackmania") {
      runTrackmania(command);
      return;
    }

    const [name = "", ...args] = command.split(/\s+/);
    const slug = args[0]?.toLowerCase();
    let lines: TerminalLine[];

    if (lower === "sudo hire-me") {
      lines = [
        {
          text: "escalating privileges... granted. CV: /cv/muhammad-afsah-cv.pdf — references available, refusals recorded on-chain.",
          href: "/cv/muhammad-afsah-cv.pdf",
          hrefLabel: "/cv/muhammad-afsah-cv.pdf",
        },
      ];
    } else if (lower === "rm -rf /" || lower === "rm -rf /*") {
      lines = [{ text: "refused. restraint is recorded on-chain around here." }];
    } else if (lower.startsWith("sudo ")) {
      lines = [{ text: "nice try. this machine has exactly one operator." }];
    } else {
      switch (name.toLowerCase()) {
        case "help":
          lines = helpLines;
          break;
        case "whoami":
          lines = [
            { text: "", image: "/photos/pfp_1.jpg", imageAlt: `${identity.name} — ${identity.handle}` },
            { text: `${identity.name} — ${identity.handle}` },
            { text: identity.role },
            { text: identity.location },
            { text: "yes, that photo was taken at 3 a.m. benchmarking something.", tone: "dim" },
          ];
          break;
        case "ls":
          lines = sortedProjects.map((project) => ({
            text: `${project.slug} [${project.status}]`,
          }));
          break;
        case "cat": {
          const project = slug ? projectsBySlug.get(slug) : undefined;

          lines = project
            ? [
                { text: project.name, tone: "bone" },
                { text: project.status },
                { text: project.tagline },
                { text: project.links.repo },
              ]
            : [{ text: `cat: ${args.join(" ") || "<slug>"}: no such project. try 'ls'`, tone: "error" }];
          break;
        }
        case "open": {
          const project = slug ? projectsBySlug.get(slug) : undefined;

          if (!project) {
            lines = [{ text: `open: ${args.join(" ") || "<slug>"}: no such project. try 'ls'`, tone: "error" }];
            break;
          }

          if (project.tier === 1) {
            lines = [{ text: `opening /work/${project.slug}` }];
            window.setTimeout(() => {
              window.location.href = `/work/${project.slug}`;
            }, 80);
          } else {
            lines = [{ text: `opening ${project.links.repo}` }];
            window.open(project.links.repo, "_blank", "noopener,noreferrer");
          }
          break;
        }
        case "exit":
          lines = [{ text: "there is no exit. scroll on." }];
          window.setTimeout(blurInput, 0);
          break;
        case "neofetch":
          lines = [
            { text: `+-- ${identity.handle} --+`, tone: "bone" },
            { text: `| role: ${identity.role}` },
            { text: "| GPU: 4 GB VRAM (yes, really)" },
            { text: "| OS: whatever runs the machine" },
            { text: `| ARC-C ${avaMetric?.value ?? "82.0%"}`, tone: "signal" },
          ];
          break;
        default:
          lines = [{ text: `command not found: ${name}. try 'help'`, tone: "error" }];
      }
    }

    pushBlock({ command, lines });
  };

  const onSubmit = () => {
    const command = value;

    if (command.trim()) {
      markInteraction();
      setHistory((current) => [...current, command.trim()]);
    }

    setHistoryIndex(null);
    setValue("");
    runCommand(command);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!hasTyped) {
      setHasTyped(true);
    }

    markInteraction();

    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHistoryIndex((current) => {
        const next = current === null ? history.length - 1 : Math.max(current - 1, 0);

        if (next >= 0) {
          setValue(history[next]);
          return next;
        }

        return current;
      });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHistoryIndex((current) => {
        if (current === null) {
          return current;
        }

        const next = current + 1;

        if (next >= history.length) {
          setValue("");
          return null;
        }

        setValue(history[next]);
        return next;
      });
    }
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => () => {
    animationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (hasInteractedRef.current || idleHintPlayedRef.current || reducedMotionRef.current) {
      return undefined;
    }

    const startTimer = window.setTimeout(() => {
      if (hasInteractedRef.current || idleHintPlayedRef.current || reducedMotionRef.current) {
        return;
      }

      idleHintPlayedRef.current = true;
      const hint = "help";

      for (let index = 1; index <= hint.length; index += 1) {
        schedule(() => {
          if (!hasInteractedRef.current) {
            setValue(hint.slice(0, index));
          }
        }, index * 150);
      }

      schedule(() => {
        if (!hasInteractedRef.current) {
          setValue(hint);
        }
      }, 2600);

      for (let index = hint.length - 1; index >= 0; index -= 1) {
        schedule(() => {
          if (!hasInteractedRef.current) {
            setValue(hint.slice(0, index));
          }
        }, 2700 + (hint.length - index) * 90);
      }
    }, 25000);

    return () => {
      window.clearTimeout(startTimer);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (hasTyped) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % hints.length);
    }, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, [hasTyped]);

  useEffect(() => {
    const onTerminalLine = (event: Event) => {
      const line = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : undefined;

      if (line) {
        pushBlock({ lines: [{ text: line, tone: "bone" }] });
      }
    };

    window.addEventListener(TERMINAL_EVENT, onTerminalLine);

    return () => {
      window.removeEventListener(TERMINAL_EVENT, onTerminalLine);
    };
  });

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [blocks]);

  return (
    <section
      role="region"
      aria-label="Interactive terminal"
      className="mt-8 h-[22rem] overflow-hidden border border-faint bg-void/85 font-mono text-sm text-ink focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-bone"
      onClick={() => {
        markInteraction();
        inputRef.current?.focus();
      }}
    >
      <div className="flex items-baseline justify-between border-b border-faint px-4 py-3">
        <p className="text-xs uppercase tracking-[0.18em] text-bone">{"// TERMINAL"}</p>
        <p className="text-xs text-dim">the interface layer</p>
      </div>
      <div ref={scrollRef} className="h-[calc(22rem-3rem)] overflow-y-auto px-4 py-3" aria-live="polite">
        <div className="space-y-3">
          {blocks.map((block) => (
            <div key={block.id}>
              {block.command ? (
                <p>
                  <span className="text-dim">afsah@name0x0:~$ </span>
                  <span>{block.command}</span>
                </p>
              ) : null}
              {block.lines.map((line, index) =>
                line.image ? (
                  <Image
                    key={`${block.id}-${index}`}
                    src={line.image}
                    alt={line.imageAlt ?? ""}
                    width={96}
                    height={96}
                    unoptimized
                    className="my-1 h-24 w-24 border border-faint object-cover grayscale contrast-125"
                  />
                ) : (
                  <p key={`${block.id}-${index}`} className={toneClass(line.tone)}>
                    {renderLinkedText(line)}
                  </p>
                ),
              )}
            </div>
          ))}
          <div className="flex min-w-0 items-center">
            <label htmlFor={inputId} className="sr-only">
              Terminal command
            </label>
            <span className="shrink-0 text-dim">afsah@name0x0:~$ </span>
            <input
              ref={inputRef}
              id={inputId}
              value={value}
              onChange={(event) => {
                markInteraction();
                setValue(event.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder={hasTyped ? "" : hints[hintIndex]}
              className="min-w-0 flex-1 bg-transparent px-1 text-ink placeholder:text-dim focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export { TERMINAL_EVENT };
