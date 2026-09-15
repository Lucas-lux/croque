/** Lowercase, strip accents and extra spaces so "Épinards" matches "epinard". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Loose match: every token of the needle appears in the haystack, singular/plural tolerant. */
export function looselyIncludes(haystack: string, needle: string): boolean {
  const h = normalize(haystack)
  const n = normalize(needle)
  if (!n) return false
  return n
    .split(' ')
    .filter(Boolean)
    .every((tok) => {
      const stem = tok.length > 4 && tok.endsWith('s') ? tok.slice(0, -1) : tok
      return h.includes(stem)
    })
}

export function pluralize(n: number, singular: string, plural = singular + 's') {
  return n <= 1 ? singular : plural
}
