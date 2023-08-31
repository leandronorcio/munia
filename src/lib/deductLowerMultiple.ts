/**
 * Returns the difference between the `given` number and the nearest
 * lower multiple of `multipleOf`. For example, `multipleOf` is `3`:
 * If the given number is 9, the nearest lower multiple of 3 to 9 is 9, then it must be 9-9=0.
 * If the given number is 10, the nearest lower multiple of 3 to 10 is 9, then it must be 10-9=1.
 * If the given number is 11, the nearest lower multiple of 3 to 11 is 9, then it must be 11-9=2.
 * @param given number
 * @param multipleOf number
 * @returns number
 */
export function deductLowerMultiple(given: number, multipleOf: number) {
  return given - Math.floor(given / multipleOf) * multipleOf;
}
