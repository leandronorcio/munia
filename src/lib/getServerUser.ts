import 'server-only';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export async function getServerUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return [user];
}
