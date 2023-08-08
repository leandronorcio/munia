'use client';
import { TextAreaWithMentionsAndHashTags } from '@/components/TextAreaWithMentionsAndHashTags';

export default function Messages() {
  return (
    <div className="w-full">
      <div className="h-[300px]"></div>
      <div className="w-full bg-red-300">
        <TextAreaWithMentionsAndHashTags />
      </div>
    </div>
  );
}
