import { ProfileHeader } from './ProfileHeader';
import { getProfile } from './getProfile';
import { getServerUser } from '@/lib/getServerUser';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);
  if (!profile)
    return <p>This user does not exist or may have changed their username.</p>;
  const isOwnProfile = profile.id === user?.id;

  return (
    <div className="pb-0 md:pb-0">
      <ProfileHeader isOwnProfile={isOwnProfile} initialProfileData={profile} />
      <div className="px-4">{children}</div>
    </div>
  );
}
