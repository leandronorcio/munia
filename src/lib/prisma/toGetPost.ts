/**
 * Use this function to convert the result of using the `./selectPost`
 * in a Prisma post find query, to the <GetPost> type.
 */
import { FindPostResult, GetPost } from 'types';

export function toGetPost(findPostResult: FindPostResult): GetPost {
  /**
   * Exclude the `postLikes` property as this is not needed in <GetUser>,
   * it is only used to determine whether the user requesting the post
   * has liked the post or not.
   */
  const { postLikes, ...rest } = findPostResult;
  return {
    ...rest,
    isLiked: postLikes.length > 0,
  };
}
