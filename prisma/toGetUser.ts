import { FindUserResult, GetUser } from '@/types/definitions';

/**
 * Converts a `FindUserResult` (Prisma user query) to `GetUser` type.
 * @param user The user object fetched from Prisma.
 * @param currentUserId The currently authenticated user's ID (optional).
 * @returns A GetUser object.
 */
export function toGetUser(user: FindUserResult, currentUserId?: string): GetUser {
  // Properly narrow types for TypeScript
  if (user.username == null || user.name == null) {
    throw new Error('User is not fully set up');
  }

  return {
    id: user.id,
    username: user.username, // TypeScript now knows this is string
    name: user.name, // TypeScript now knows this is string
    profilePhoto: user.profilePhoto ?? null,
    followerCount: user._count.followers ?? 0,
    followingCount: user._count.following ?? 0,
    isFollowing: currentUserId ? user.followers.some((f) => f.followerId === currentUserId) : null,
  };
}
