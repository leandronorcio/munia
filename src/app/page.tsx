import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { Onboarding } from './Onboarding';
import { Feed } from './Feed';

export default async function Page() {
  const [user] = await useProtectApiRoute();
  return <>{user ? <Feed /> : <Onboarding />}</>;
}
