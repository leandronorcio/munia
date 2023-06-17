import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Onboarding from './Onboarding';
import ProfilePhoto from '@/components/ProfilePhoto';
import TextArea from '@/components/TextArea';
import MakePostOptions from './MakePostOptions';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <Onboarding />;
  } else {
    return (
      <>
        <h1 className="font-bold text-4xl mb-6">News Feed</h1>
        <div className="p-6 rounded-xl bg-slate-50">
          <div className="flex flex-row mb-[18px] ">
            <div className="w-11 h-11">
              <ProfilePhoto />
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <TextArea placeholder="What's on your mind?" />
            </div>
          </div>
          <MakePostOptions />
        </div>
      </>
    );
  }
}
