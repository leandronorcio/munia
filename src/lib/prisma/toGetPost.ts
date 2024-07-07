/**
 * Use this function to convert the result of using the `./selectPost`
 * in a Prisma `post` find query, to the <GetPost> type.
 */
import { FindPostResult, GetPost, GetVisualMedia } from '@/types/definitions';
import { convertMentionUsernamesToIds } from '../convertMentionUsernamesToIds';
import { fileNameToUrl } from '../s3/fileNameToUrl';

export async function toGetPost(findPostResult: FindPostResult): Promise<GetPost> {
  /**
   * Exclude the `postLikes` property as this is not needed in <GetPost>,
   * it is only used to determine whether the user requesting the post
   * has liked the post or not.
   */
  const { postLikes, content, ...rest } = findPostResult;

  // Convert the `@` `id` mentions back to usernames
  const { str } = await convertMentionUsernamesToIds({
    str: content || '',
    reverse: true,
  });

  const visualMedia: GetVisualMedia[] = rest.visualMedia.map(({ type, fileName }) => ({
    type,
    url: fileNameToUrl(fileName) as string,
  }));

  return {
    ...rest,
    user: {
      id: rest.user.id,
      // The `name` and `username` are guaranteed to be filled after the user's registration,
      // thus we can safely use non-null assertion here.
      username: rest.user.username!,
      name: rest.user.name!,
      // Convert the `profilePhoto` file name to a full S3 URL
      profilePhoto: fileNameToUrl(rest.user.profilePhoto),
    },
    visualMedia,
    content: str,
    isLiked: postLikes.length > 0,
  };
}
