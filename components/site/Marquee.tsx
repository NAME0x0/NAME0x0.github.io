const text = "MEASURED · LIVE · SPEC / IN PROGRESS · SHIPPED · ";

export function Marquee() {
  return (
    <div aria-hidden="true" className="marquee-band border-y border-faint py-4 font-mono text-sm uppercase tracking-[0.22em] text-faint transition-colors hover:text-dim">
      <div className="marquee-track flex w-max">
        <span className="pr-8">{text.repeat(6)}</span>
        <span className="pr-8">{text.repeat(6)}</span>
      </div>
    </div>
  );
}
