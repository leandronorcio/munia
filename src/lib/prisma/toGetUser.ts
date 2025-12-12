import { FindUserResult, GetUser } from '@/types/definitions';

export function toGetUser(user: FindUserResult, currentUserId?: string): GetUser {
  if (!user.username || !user.name) {
    throw new Error('User is not fully set up');
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    profilePhoto: user.profilePhoto ?? null,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    isFollowing: currentUserId ? user.followers.some((f) => f.followerId === currentUserId) : null,
  };
}
