import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Onboarding from './Onboarding';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <>{!session && <Onboarding />}</>;
}
