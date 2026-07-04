type GhostNumeralProps = {
  value: string;
};

export function GhostNumeral({ value }: GhostNumeralProps) {
  return (
    <span data-ghost-numeral className="ghost-numeral" aria-hidden="true">
      {value}
    </span>
  );
}
