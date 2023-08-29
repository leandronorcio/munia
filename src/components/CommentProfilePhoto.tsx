import { ProfilePhoto } from './ui/ProfilePhoto';

export function CommentProfilePhoto({
  username,
  photoUrl,
}: {
  username: string | null;
  photoUrl: string | null;
}) {
  return (
    <div className="h-10 w-10 flex-shrink-0">
      <ProfilePhoto username={username} photoUrl={photoUrl} />
    </div>
  );
}
