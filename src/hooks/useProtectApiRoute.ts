import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export async function useProtectApiRoute() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return [user];
}
