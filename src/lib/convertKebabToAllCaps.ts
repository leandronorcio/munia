export function convertKebabToAllCaps(
  kebabCaseString: string | null | undefined
) {
  if (kebabCaseString == null) return kebabCaseString;
  // Replace hyphens with underscores
  const stringWithUnderscores = kebabCaseString.replace(/-/g, '_');

  // Convert to all caps
  const allCapsString = stringWithUnderscores.toUpperCase();

  return allCapsString;
}
