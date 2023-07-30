import { ProfilePhoto } from './ui/ProfilePhoto';

export function CommentProfilePhoto({
  userId,
  username,
  photoUrl,
}: {
  userId: string;
  username: string | null;
  photoUrl: string | null;
}) {
  return (
    <div className="h-10 w-10 flex-shrink-0">
      <ProfilePhoto userId={userId} username={username} photoUrl={photoUrl} />
    </div>
  );
}
