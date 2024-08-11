// https://github.com/prisma/prisma/issues/6219#issuecomment-840676092
import { PrismaClient } from '@prisma/client';

declare global {
  interface Global {
    prisma: PrismaClient;
  }
}

// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // @ts-expect-error `global` is a global object in the browser
    if (!global.prisma) {
      // @ts-expect-error `global` is a global object in the browser
      global.prisma = new PrismaClient();
    }
    // @ts-expect-error `global` is a global object in the browser
    prisma = global.prisma;
  }
}
// @ts-expect-error `global` is a global object in the browser
export default prisma;
