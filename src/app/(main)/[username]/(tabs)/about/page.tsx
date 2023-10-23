import { getProfile } from '../../getProfile';
import { About } from './About';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);
  if (!profile) return <></>;

  return (
    <div className="mt-4">
      <About profile={profile} />
    </div>
  );
}
