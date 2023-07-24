import { Onboarding } from './Onboarding';
import { Feed } from './Feed';
import { getServerUser } from '@/lib/getServerUser';

export default async function Page() {
  const [user] = await getServerUser();
  return <>{user ? <Feed /> : <Onboarding />}</>;
}
