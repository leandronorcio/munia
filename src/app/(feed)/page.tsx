import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import MakePostOptions from './MakePostOptions';
import Post from '@/components/Post';

export default function Page() {
  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h1 className="font-bold text-4xl mb-6">News Feed</h1>
      <div className="p-6 rounded-xl bg-slate-50 mb-6">
        <div className="flex flex-row mb-[18px] ">
          <div className="w-11 h-11">
            <ProfilePhoto />
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <TextArea placeholder="What's on your mind?" />
          </div>
        </div>
        <MakePostOptions />
      </div>
      <Post />
    </div>
  );
}
