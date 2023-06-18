import Post from '@/components/Post';
import MakePost from './MakePost';

export default function Page() {
  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h1 className="font-bold text-4xl mb-6">News Feed</h1>
      <MakePost />
      <Post />
    </div>
  );
}