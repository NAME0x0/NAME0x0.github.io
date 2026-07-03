const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F]/g;
const MAX_TEXT_LENGTH = 300;

export function sanitizeText(input: string): string {
  return input
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LENGTH)
    .trim();
}
