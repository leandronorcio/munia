import 'server-only';

/**
 * Hook to easily filter posts, this allows paginated queries with varying directions ('asc' and 'desc')
 * @param url
 */
export function usePostsSorter(url: string) {
  const { searchParams } = new URL(url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const cursor = parseInt(searchParams.get('cursor') || '0', 10);
  const sortDirection = (searchParams.get('sort-direction') as 'asc' | 'desc') || 'desc';

  /**
   * This is an alternative approach to Prisma's cursor-based pagination
   * that does not return the expected results when the cursor no longer
   * exists.
   * The issue links:
   * https://github.com/prisma/prisma/issues/3362
   * https://github.com/prisma/prisma/issues/8560
   */
  const filters = cursor
    ? {
        id: {
          ...(sortDirection === 'desc' && {
            lt: cursor,
          }),
          ...(sortDirection === 'asc' && {
            gt: cursor,
          }),
        },
      }
    : undefined;

  const limitAndOrderBy = {
    take: limit,
    orderBy: {
      id: sortDirection,
    },
  };

  return { filters, limitAndOrderBy };
}
