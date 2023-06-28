'use client';
import { formatDistanceStrict } from 'date-fns';
import ProfileBlock from './ProfileBlock';

export default function Comment({
  id: commentId,
  content,
  createdAt,
  user: author,
}: CommentType) {
  return (
    <div className="flex flex-col items-start">
      <ProfileBlock
        type="comment"
        name={author.name!}
        photoUrl={author.profilePhoto!}
        time={formatDistanceStrict(new Date(createdAt), new Date())}
      />
      <p className="-mt-3 ml-[60px] p-3 bg-slate-200 rounded-2xl">{content}</p>
    </div>
  );
}
