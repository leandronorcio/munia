import parse, { Element, domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';
import Link from 'next/link';
export function HighlightedMentionsAndHashTags({
  text,
  shouldAddLinks,
}: {
  text: string;
  shouldAddLinks?: boolean;
}) {
  /**
   * Define a regex pattern to match words that begin with `@` or `#`
   *
   * * The first group matches either the start of a line (^) or a whitespace character (\s)
   * * The second group matches either the `@` or `#`
   * * The third group matches the word after the `@` or `#`
   */
  const pattern = /(^|\s)(@|#)(\w+|\w+)/g;
  const cleanText = DOMPurify.sanitize(
    text.replace(/</g, '&lt;').replace(/>/, '&gt;'),
  );

  // Use replace() method to surround the matches' word with the <span> tag
  const html = cleanText.replace(
    pattern,
    (match, space: string, char: string, word: string) => {
      const coloredWord = `<span class="text-blue-600">${char}${word}</span>`;

      if (!shouldAddLinks) return `${space}${coloredWord}`;
      return `${space}<a href="${word}">${coloredWord}</a>`;
    },
  );

  if (!shouldAddLinks) return parse(html) as JSX.Element;
  return parse(html, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.children)
        return (
          <Link href={domNode.attribs.href}>
            {domToReact(domNode.children)}
          </Link>
        );
    },
  }) as JSX.Element;
}
