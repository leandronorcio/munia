import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../getProfile';
import { About } from './About';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);
  const isOwnProfile = user?.id === profile?.id;

  return <About profile={profile!} isOwnProfile={isOwnProfile} />;
}
