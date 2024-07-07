import { Posts } from '@/components/Posts';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../getProfile';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: profile?.name || 'Munia',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);
  const shouldShowCreatePost = user?.id === profile?.id;

  return (
    <div>
      {shouldShowCreatePost && (
        <div className="mt-4">
          <CreatePostModalLauncher />
        </div>
      )}
      {profile && <Posts type="profile" userId={profile.id} />}
    </div>
  );
}
