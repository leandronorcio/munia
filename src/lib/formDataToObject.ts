/**
 * Use this function instead of `Object.fromEntries()` when converting
 * a `FormData` (a list of key-value pairs) that contains duplicate names.
 * Those with duplicate names will be grouped into one property as an array.
 *
 * Example:
 * FormData {
 *   [Symbol(state)]: [
 *     { name: 'content', value: 'Testing.' },
 *     { name: 'files', value: [File] },
 *     { name: 'files', value: [File] }
 *   ]
 * }
 * the above is equivalent to:
 * [
 *  [ 'content', 'Testing.' ],
 *  [ 'files', Blob { size: 14872399, type: 'video/mp4' } ],
 *  [ 'files', Blob { size: 3510777, type: 'image/png' } ],
 * ]
 * will be converted to:
 * {
 *   content: 'Testing.',
 *   files: [
 *     Blob { size: 14872399, type: 'video/mp4' },
 *     Blob { size: 3510777, type: 'image/png' }
 *   ]
 * }
 */
export function formDataToObject(formData: FormData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const object: Record<string, any> = {};

  // Loop over each [key, value] pair
  for (const [key, value] of formData) {
    if (object[key]) {
      if (Array.isArray(object[key])) {
        // If the `key` is already present in `object`, and it is an array, push the current `value`
        object[key].push(value);
      } else {
        // If the `key` is already present in `object`, and it is NOT yet an array,
        // create an array the contains the pre-existing value `object[key]` and the current `value`
        object[key] = [object[key], value];
      }
    } else {
      // If the `key` is not yet present in `object`, create it and assign the `value`
      object[key] = value;
    }
  }

  return object;
}
