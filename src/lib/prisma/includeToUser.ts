export function includeToUser(currentUserId?: string) {
  return {
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
    followers: {
      select: {
        followerId: true,
      },
    },
  };
}
