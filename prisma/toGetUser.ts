import { FindUserResult, GetUser } from '@/types/definitions';

/**
 * Converts a `FindUserResult` (Prisma user query) to `GetUser` type.
 * @param user The user object fetched from Prisma.
 * @param currentUserId The currently authenticated user's ID (optional).
 * @returns A GetUser object.
 */
export function toGetUser(user: FindUserResult, currentUserId?: string): GetUser {
  // Ensure TypeScript that these fields exist
  if (!user.username || !user.name) {
    throw new Error('User is not fully set up');
  }

  return {
    id: user.id,
    username: user.username, // non-null because of the check
    name: user.name, // non-null because of the check
    profilePhoto: user.profilePhoto ?? null,
    followerCount: user._count.followers ?? 0,
    followingCount: user._count.following ?? 0,
    isFollowing: currentUserId ? user.followers.some((f) => f.followerId === currentUserId) : null,
  };
}
