import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../getProfile';
import { About } from './About';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [user] = await getServerUser();

  // TODO: Fix this
  const isOwnProfile = params.username === user?.username;
  const profile = await getProfile(params.username);

  return <About profile={profile!} isOwnProfile={isOwnProfile} />;
}
