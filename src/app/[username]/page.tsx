import { Posts } from '@/components/Posts';
import { getProfile } from './getProfile';
import type { User } from '@prisma/client';

// Posts sub-page.
export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile: User | null = await getProfile(params.username);
  return <Posts type="profile" userId={profile?.id!} />;
}
