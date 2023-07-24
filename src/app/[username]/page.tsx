import { Posts } from '@/components/Posts';
import { getProfile } from './getProfile';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { GetUser } from 'types';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';

// Posts sub-page.
export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [user] = await useProtectApiRoute();
  const profile: GetUser | null = await getProfile(params.username);
  const shouldShowCreatePost = user?.id === profile?.id;

  return (
    <div>
      {shouldShowCreatePost && <CreatePostModalLauncher />}
      <Posts type="profile" userId={profile?.id!} />
    </div>
  );
}
