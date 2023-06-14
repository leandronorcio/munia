import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function useProtectApiRoute() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return [user];
}
