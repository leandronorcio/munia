import { z } from 'zod';
import { sub } from 'date-fns';

const nonEmptyString = z.string().trim().min(3, { message: 'Value must be at least three characters' });

export const userAboutSchema = z.object({
  username: nonEmptyString.regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Only alphanumeric characters and underscores are allowed',
  }),
  // email: nonEmptyString.email(),
  name: nonEmptyString,
  phoneNumber: nonEmptyString
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number' })
    .nullable(),
  bio: nonEmptyString.nullable(),
  website: nonEmptyString
    .regex(/^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/, {
      message: 'Invalid website',
    })
    .nullable(),
  address: nonEmptyString.nullable(),
  gender: z.union([z.literal('FEMALE'), z.literal('MALE'), z.literal('NONBINARY')]).nullable(),
  relationshipStatus: z
    .union([z.literal('SINGLE'), z.literal('IN_A_RELATIONSHIP'), z.literal('ENGAGED'), z.literal('MARRIED')])
    .nullable(),
  birthDate: z.nullable(
    z.string().superRefine((value, ctx) => {
      const today = new Date();
      const selectedDate = new Date(value);

      const min = sub(today, { years: 85 });
      const max = sub(today, { years: 18 });

      if (selectedDate > max) {
        // you must be at least 18 years old
        ctx.addIssue({
          message: 'You must be at least 18 years old',
          code: z.ZodIssueCode.invalid_date,
        });
      }

      if (selectedDate < min) {
        // you must be younger than
        ctx.addIssue({
          message: 'You must be younger than 85 years old',
          code: z.ZodIssueCode.invalid_date,
        });
      }
    }),
  ),
});

export type UserAboutSchema = z.infer<typeof userAboutSchema>;
