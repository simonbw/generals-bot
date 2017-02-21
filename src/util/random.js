// @flow

/**
 * Choose a random item from an array.
 */
export function choose<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
