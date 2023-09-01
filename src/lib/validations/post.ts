import { Blob } from 'buffer';
import { z } from 'zod';

export const postWriteSchema = z
  .object({
    // `content` is optional, but if it is provided, make sure that
    // it does not only contain spaces
    content: z.optional(
      z.string().refine((value) => value.trim() !== '', {
        message: 'Content should not contain only spaces.',
      }),
    ),
    files: z
      .union([z.instanceof(Blob), z.array(z.instanceof(Blob))])
      .optional(),
  })
  .refine((data) => data.content !== undefined || data.files !== undefined, {
    message: "Either 'content' or 'files' must be defined.",
  });
