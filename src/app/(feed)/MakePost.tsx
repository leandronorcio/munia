'use client';
import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import MakePostOptions from './MakePostOptions';

export default function MakePost() {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-slate-50 mb-6">
      <div className="flex flex-row mb-[18px] ">
        <div className="w-11 h-11">
          <ProfilePhoto />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <TextArea placeholder="What's on your mind?" />
        </div>
        <div>
          <Button mode="secondary" onClick={() => {}} size="small" disabled>
            Post
          </Button>
        </div>
      </div>
      <MakePostOptions />
    </div>
  );
}
