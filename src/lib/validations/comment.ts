import { z } from 'zod';

export const commentWriteSchema = z.object({
  content: z.string().refine((value) => value.trim().length > 0, {
    message: 'Content must not be empty or contain only spaces.',
  }),
});
