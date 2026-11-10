/**
 * Small text and id rules shared by the board model and the records model.
 * Kept in their own module so both can import them without a cycle.
 * @module dsh-project-kanban/shared/text
 */

/** Ids are short, URL-safe strings made by the browser. */
export const ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/

/**
 * Trim and collapse a one-line text; undefined when empty or too long.
 * @param value - untrusted input.
 * @param max - maximum length after trimming.
 */
export function cleanLine(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.replace(/\s+/g, ' ').trim()
  if (text === '' || text.length > max) return undefined
  return text
}

/**
 * Normalise a one-line text that may be empty and keeps its inner spacing
 * (a path with two spaces in it must stay that path). Line breaks become
 * spaces. Undefined when not a string or too long.
 * @param value - untrusted input.
 * @param max - maximum length after trimming.
 */
export function cleanPath(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.replace(/[\r\n]+/g, ' ').trim()
  return text.length > max ? undefined : text
}

/**
 * Normalise a multi-line text that may be empty; undefined when not a
 * string or too long.
 * @param value - untrusted input.
 * @param max - maximum length after trimming.
 */
export function cleanText(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.replace(/\r\n?/g, '\n').trim()
  return text.length > max ? undefined : text
}
