const res: FindUserResult[] = await prisma.user.findMany({
  where: {
    ...(search && searchUser(search)),
    ...(gender && { gender }),
    ...(relationshipStatus && { relationshipStatus }),
    ...(followersOf && { following: { some: { followingId: followersOf } } }),
    ...(followingOf && { followers: { some: { followerId: followingOf } } }),
    id: { not: user?.id },
    name: { not: null },
    username: { not: null },
  },
  select: {
    id: true,
    username: true,
    name: true,
    profilePhoto: true,
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
  },
  take: limit,
  skip: offset,
});
