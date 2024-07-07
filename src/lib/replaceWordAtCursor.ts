export function replaceWordAtCursor(inputString: string, cursorPosition: number, replacementWord: string) {
  const words = inputString.split(/\s/); // Split the input string into words
  let currentCursor = 0;

  for (const word of words) {
    const wordLength = word.length;
    const wordStart = currentCursor;
    const wordEnd = currentCursor + wordLength;

    if (cursorPosition >= wordStart && cursorPosition < wordEnd) {
      // Replace the word at the cursor position
      const beforeCursor = inputString.slice(0, wordStart);
      const afterCursor = inputString.slice(wordEnd);
      const modifiedString = beforeCursor + replacementWord + afterCursor;

      return modifiedString;
    }

    currentCursor = wordEnd + 1; // +1 to account for the space between words
  }

  // Cursor position is beyond the end of the string
  return inputString;
}
