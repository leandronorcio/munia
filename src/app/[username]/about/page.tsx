import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { getProfile } from '../getProfile';
import { About } from './About';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [user] = await useProtectApiRoute();

  const isOwnProfile = params.username === user?.username;
  const profile = await getProfile(params.username);

  return <About profile={profile!} isOwnProfile={isOwnProfile} />;
}
