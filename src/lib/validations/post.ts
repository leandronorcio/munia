import { Blob } from 'buffer';
import { z } from 'zod';

export const postWriteSchema = z
  .object({
    content: z.string().optional(),
    files: z
      .union([z.instanceof(Blob), z.array(z.instanceof(Blob))])
      .optional(),
  })
  .refine((data) => data.content !== undefined || data.files !== undefined, {
    message: "Either 'content' or 'files' must be defined",
  });
