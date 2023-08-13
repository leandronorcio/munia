import 'server-only';
import { uniq } from 'lodash';
import prisma from './prisma/prisma';

/**
 * Converts the `@` `username` mentions to the `id`s of the users. It is
 * crucial to store the `@` mentions with the users' `id`s as the `username`
 * can change.
 *
 * @param str The string to process.
 * @param reverse Whether to convert the other way around - `id` to `username`.
 * @returns The processed string.
 */
export async function convertMentionUsernamesToIds({
  str,
  reverse = false,
}: {
  str: string;
  reverse?: boolean;
}) {
  const pattern = /(^|\s)(@)(\w+|\w+)/g;
  const matches = str.match(pattern)?.map((match) => match.slice(2));

  // If there are no `@` mentions return the original string
  if (!matches) return str;

  // The `matchesUnique` can either be the id/username of the mentioned users
  const matchesUnique = uniq(matches);

  const users = await prisma.user.findMany({
    where: {
      ...(!reverse
        ? {
            username: {
              in: matchesUnique,
            },
          }
        : {
            id: {
              in: matchesUnique,
            },
          }),
    },
    select: {
      id: true,
      username: true,
    },
  });

  // Replace the matches with the id/username of the users
  const res = str.replace(pattern, (match, space, char, word) => {
    const user = users.find(
      (user) => (!reverse ? user.username : user.id) === word,
    );
    return `${space}${char}${
      user ? (reverse ? user.username : user.id) : word
    }`;
  });

  return res;
}
