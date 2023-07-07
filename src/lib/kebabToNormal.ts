export function kebabToNormal(str: string) {
  // Split the string by hyphen
  const words = str.split('-');

  // Capitalize each word and join them
  const result = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return result;
}
