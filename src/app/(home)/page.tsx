import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Onboarding from './Onboarding';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <Onboarding />;
  } else {
    return <h1>News Feed</h1>;
  }
}
