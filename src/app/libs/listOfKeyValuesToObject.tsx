/**
 * Use this function instead of `Object.entries` when converting
 * a list of key-value pairs that contains duplicate keys. Those
 * with duplicate keys will be grouped into one key as an array.
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
export function listOfKeyValuesToObject(listOfKeyValues: any) {
  const body: any = {};
  for (const item of listOfKeyValues) {
    const [key, value] = item;
    if (body.hasOwnProperty(key)) {
      if (Array.isArray(body[key])) {
        body[key].push(value);
      } else {
        body[key] = [body[key], value];
      }
    } else {
      body[key] = value;
    }
  }
  return body;
}
