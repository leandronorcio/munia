import { FindCommentResult, GetComment } from 'types';
import { convertMentionUsernamesToIds } from '../convertMentionUsernamesToIds';

export async function toGetComment(
  findCommentResult: FindCommentResult,
): Promise<GetComment> {
  const { commentLikes, content, ...rest } = findCommentResult;
  const isLiked = commentLikes.length > 0;

  // Convert the `@` `id` mentions back to usernames
  const contentWithUsernameMentions =
    content && (await convertMentionUsernamesToIds(content, true));
  return {
    isLiked,
    content: contentWithUsernameMentions,
    ...rest,
  };
}
