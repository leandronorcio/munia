import { getProfile } from '../../getProfile';
import { About } from './About';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `About | ${profile?.name}` || 'About',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  if (!profile) return null;

  return (
    <div className="mt-4">
      <About profile={profile} />
    </div>
  );
}
