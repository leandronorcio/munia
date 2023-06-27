export function areObjectsEqual(obj1: any, obj2: any) {
  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate over the keys and compare the values
  for (let key of keys1) {
    // Check if the current key exists in both objects
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }

    // Check if the values of the current key are equal
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  // All keys and values are equal
  return true;
}
