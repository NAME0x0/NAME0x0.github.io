export const SECTION_ORDER = ["hero", "stack", "projects", "about", "contact"] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

export const DESKTOP_NAV_ITEMS: ReadonlyArray<{ id: Exclude<SectionId, "hero">; label: string }> = [
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const MOBILE_NAV_ITEMS: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: "hero", label: "Home" },
  ...DESKTOP_NAV_ITEMS,
] as const;

const SECTION_SET = new Set<string>(SECTION_ORDER);

export function isSectionId(value: string): value is SectionId {
  return SECTION_SET.has(value);
}

export function getSectionPosition(id: string): number {
  const index = SECTION_ORDER.indexOf(id as SectionId);
  return index >= 0 ? index + 1 : 0;
}
