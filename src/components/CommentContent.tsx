import { formatDistance } from 'date-fns';

export function CommentContent({
  name,
  username,
  content,
  createdAt,
}: {
  name: string | null;
  username: string | null;
  content: string;
  createdAt: string | Date;
}) {
  return (
    <>
      <h3 className="text-md font-semibold">{name}</h3>
      <p className="text-gray-499 text-gray-500">@{username}</p>
      <div className="my-2 self-start rounded-2xl rounded-ss-none bg-slate-100 px-4 py-3">
        <p className="mb-2 text-gray-700">{content}</p>
        <p className="ml-auto text-sm text-gray-500">
          {formatDistance(new Date(createdAt), new Date())} ago
        </p>
      </div>
    </>
  );
}
