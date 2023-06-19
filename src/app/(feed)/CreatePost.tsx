'use client';
import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import CreatePostOptions from './CreatePostOptions';
import { useState } from 'react';
import PostVisualMediaContainer from '@/components/PostVisualMediaContainer';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [visualMediaFiles, setVisualMediaFiles] = useState<File[]>([]);

  const handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { name, files } = e.target;

    if (files === null) return;
    const filesArr = [...files];
    console.log(filesArr);
    setVisualMediaFiles((prev) => [...prev, ...filesArr]);
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-slate-50 mb-6">
      <div className="flex flex-row mb-[18px] ">
        <div className="w-11 h-11">
          <ProfilePhoto />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
          />
        </div>
        <div>
          <Button
            mode="secondary"
            onClick={() => {}}
            size="small"
            disabled={content === ''}
          >
            Post
          </Button>
        </div>
      </div>
      <CreatePostOptions handleVisualMediaChange={handleVisualMediaChange} />

      {visualMediaFiles.length > 0 && (
        <div className="mt-6">
          <PostVisualMediaContainer
            visualMedia={visualMediaFiles.map((file) => ({
              type: file.type.startsWith('image/') ? 'photo' : 'video',
              url: URL.createObjectURL(file),
            }))}
          />
        </div>
      )}
    </div>
  );
}
