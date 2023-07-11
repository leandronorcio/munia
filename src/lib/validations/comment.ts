import { z } from 'zod';

export const commentWriteSchema = z.object({
  content: z.string().trim(),
});
