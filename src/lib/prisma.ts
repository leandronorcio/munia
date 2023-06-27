// https://github.com/prisma/prisma/issues/5007#issuecomment-618433162
import { PrismaClient } from '@prisma/client';

let prisma: any;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
