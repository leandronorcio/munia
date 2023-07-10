export function kebabToNormal(str?: string | null) {
  // Split the string by hyphen
  if (!str) return str;
  const words = str.split('-');

  // Capitalize each word and join them
  const result = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return result;
}
