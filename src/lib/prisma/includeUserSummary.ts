export const includeUserSummary = () => ({
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      profilePhoto: true,
    },
  },
});
