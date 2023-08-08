export function highlightMentionsAndHashtags(text: string) {
  /**
   * Define a regex pattern to match words that begin with `@` or `#`
   *
   * * The first group matches either the start of a line (^) or a whitespace character (\s)
   * * The second word matches the word which is preceded by `@` or `#`
   */
  const pattern = /(^|\s)(@\w+|#\w+)/g;

  // Use replace() method to surround the matches' word with the <span> tag
  return text.replace(pattern, (match, space, word) => {
    return `${space}<span class="text-blue-600">${word}</span>`;
  });
}
