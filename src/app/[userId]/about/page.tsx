import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { redirect } from 'next/navigation';
import { getProfile } from '../getProfile';
import { About } from './About';

export default async function Page({ params }: { params: { userId: string } }) {
  const [user] = await useProtectApiRoute();
  if (!user) return redirect('/');

  const isOwnProfile = params.userId === user?.id;
  const profile = await getProfile(params.userId);

  return <About profile={profile} isOwnProfile={isOwnProfile} />;
}
