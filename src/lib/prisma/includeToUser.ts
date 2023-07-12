export const includeToUser = (userId: string | undefined) => ({
  // This `followers` here is used only for checking whether
  // the requestee is following the user being rquested.
  followers: {
    where: {
      followerId: userId,
    },
  },
  _count: {
    select: {
      followers: true,
      following: true,
    },
  },
});
