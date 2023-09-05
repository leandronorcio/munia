import { Blob } from 'buffer';
import { z } from 'zod';

const urlSchema = z.string().url();
export const postWriteSchema = z
  .object({
    // `content` is optional, but if it is provided, make sure that
    // it does not only contain spaces
    content: z.optional(
      z.string().refine((value) => value.trim() !== '', {
        message: 'Content should not contain only spaces.',
      }),
    ),
    // `files` can be a:
    // * a `Blob` or a URL
    // * an array of `Blob`s or an array of URLs
    // * an array the contains `Blob`s and URLs
    // * undefined
    files: z
      .union([
        z.instanceof(Blob),
        urlSchema,
        z.array(z.instanceof(Blob)),
        z.array(urlSchema),
        z.array(z.union([z.instanceof(Blob), urlSchema])),
      ])
      .optional(),
  })
  .refine((data) => data.content !== undefined || data.files !== undefined, {
    message: "Either 'content' or 'files' must be defined.",
  });
