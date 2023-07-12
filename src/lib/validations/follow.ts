import { z } from 'zod';

export const followPostSchema = z.object({
  userIdToFollow: z.string(),
});
