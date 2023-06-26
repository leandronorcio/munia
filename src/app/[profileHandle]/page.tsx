import { Posts } from '@/components/Posts';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';

// Posts sub-page.
export default async function Page() {
  const [user] = await useProtectApiRoute();
  if (!user) return <></>;

  return <Posts type="profile" userId={user.id} />;
}
