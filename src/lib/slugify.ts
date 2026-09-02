export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
