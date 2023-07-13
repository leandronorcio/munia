'use client';
import { useRouter } from 'next/navigation';

export function ProfilePhoto({
  photoUrl,
  username,
}: {
  photoUrl?: string | null;
  username?: string | null;
}) {
  const router = useRouter();
  return (
    <img
      src={photoUrl || '/default-profile-photo.jpg'}
      className="w-full h-full object-cover rounded-full cursor-pointer"
      onClick={() => router.push(`/${username}`)}
    />
  );
}
