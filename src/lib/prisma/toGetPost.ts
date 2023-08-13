/**
 * Use this function to convert the result of using the `./selectPost`
 * in a Prisma post find query, to the <GetPost> type.
 */
import { FindPostResult, GetPost } from 'types';
import { convertMentionUsernamesToIds } from '../convertMentionUsernamesToIds';

export async function toGetPost(
  findPostResult: FindPostResult,
): Promise<GetPost> {
  /**
   * Exclude the `postLikes` property as this is not needed in <GetUser>,
   * it is only used to determine whether the user requesting the post
   * has liked the post or not.
   */
  const { postLikes, content, ...rest } = findPostResult;

  // Convert the `@` `id` mentions back to usernames
  const contentWithUsernameMentions =
    content &&
    (await convertMentionUsernamesToIds({ str: content, reverse: true }));
  return {
    ...rest,
    content: contentWithUsernameMentions,
    isLiked: postLikes.length > 0,
  };
}
