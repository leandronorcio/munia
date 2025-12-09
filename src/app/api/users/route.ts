const res: FindUserResult[] = await prisma.user.findMany({
  where: {
    /* your filters */
  },
  select: {
    id: true,
    username: true,
    name: true,
    profilePhoto: true,
    _count: { select: { followers: true, following: true } },
    followers: { select: { followerId: true } },
  },
  take: limit,
  skip: offset,
});

const users = res.map((singleUser) => toGetUser(singleUser, user?.id));
return NextResponse.json<GetUser[]>(users);
