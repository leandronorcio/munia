import { GetVisualMedia } from '@/types/definitions';
import { getProfile } from '../../getProfile';
import { Gallery } from './Gallery';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `Photos | ${profile?.name}` || 'Photos',
  };
}

async function getVisualMedia(username: string) {
  const profile = await getProfile(username);
  const res = await fetch(`${process.env.URL}/api/users/${profile?.id}/photos`, { cache: 'no-store' });

  if (!res.ok) throw new Error("Error fetching user's photos.");
  return (await res.json()) as GetVisualMedia[];
}

export default async function Page({ params }: { params: { username: string } }) {
  const visualMedia = await getVisualMedia(params.username);
  return <Gallery visualMedia={visualMedia} />;
}
