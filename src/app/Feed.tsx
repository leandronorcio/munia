import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { Posts } from '@/components/Posts';
import { getServerUser } from '@/lib/getServerUser';

export async function Feed() {
  const [user] = await getServerUser();
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-4xl font-bold">Feed</h1>
      <CreatePostModalLauncher />
      <Posts type="feed" userId={user?.id!} />
    </div>
  );
}
