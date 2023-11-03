import 'server-only';
import { auth } from '@/auth';

export async function getServerUser() {
  const session = await auth();
  const user = session?.user;
  return [user];
}
