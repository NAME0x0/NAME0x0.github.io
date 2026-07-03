"use client";

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
  "try: sudo make me a sandwich",
];

const helpLines: TerminalLine[] = [
  { text: "help                 list every command" },
  { text: "whoami               print identity and current role" },
  { text: "ls                   list project slugs, tier 1 first" },
  { text: "cat <slug>           show project name, status, tagline, and repo" },
  { text: "open <slug>          tier 1 opens /work/<slug>; tier 2 opens the repo" },
  { text: "sudo <anything>      try the obvious mistake" },
  { text: "rm -rf /             request catastrophic restraint" },
  { text: "rm -rf /*            same refusal, different slash" },
  { text: "trackmania           print the current obsession" },
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

export function Terminal({ identity, projects }: TerminalProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const [blocks, setBlocks] = useState<OutputBlock[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [hasTyped, setHasTyped] = useState(false);
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

  const blurInput = () => {
    inputRef.current?.blur();
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

    const [name = "", ...args] = command.split(/\s+/);
    const slug = args[0]?.toLowerCase();
    let lines: TerminalLine[];

    if (lower === "rm -rf /" || lower === "rm -rf /*") {
      lines = [{ text: "refused. restraint is recorded on-chain around here." }];
    } else if (lower.startsWith("sudo ")) {
      lines = [{ text: "nice try. this machine has exactly one operator." }];
    } else {
      switch (name.toLowerCase()) {
        case "help":
          lines = helpLines;
          break;
        case "whoami":
          // TODO(owner): swap in photo asset.
          lines = [
            { text: `${identity.name} — ${identity.handle}` },
            { text: identity.role },
            { text: identity.location },
            { text: "photo pending. imagine someone who benchmarks at 3 a.m.", tone: "dim" },
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
        case "trackmania":
          lines = [
            {
              text: "current obsession: the endless pursuit of a cleaner racing line. improvement has no finish line.",
            },
          ];
          break;
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
      onClick={() => inputRef.current?.focus()}
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
              {block.lines.map((line, index) => (
                <p key={`${block.id}-${index}`} className={toneClass(line.tone)}>
                  {line.text}
                </p>
              ))}
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
              onChange={(event) => setValue(event.target.value)}
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
