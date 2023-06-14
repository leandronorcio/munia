import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ProfileActionButtons } from './ProfileActionButtons';
import { PrismaClient } from '@prisma/client';
import ProfilePhoto from './ProfilePhoto';
import CoverPhoto from './CoverPhoto';
const prisma = new PrismaClient();

async function getProfile(identifier: string) {
  const profile = await prisma.user.findFirst({
    where: {
      OR: [
        {
          id: identifier,
        },
        {
          handle: identifier,
        },
      ],
    },
  });

  return profile;
}

export default async function Page({
  params,
}: {
  params: { profileHandle: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect('/');

  const profile = await getProfile(params.profileHandle);
  if (profile === null) return redirect('/usernotfound');
  const isOwnProfile = profile?.id === session.user?.id;

  return (
    <>
      <div className="relative mb-28">
        <div
          className="h-72 md:rounded-3xl transition-all"
          style={{
            background:
              'linear-gradient(95.08deg, #AF45DB 2.49%, #EB7B96 97.19%)',
          }}
        >
          <CoverPhoto isOwnProfile={isOwnProfile} profile={profile} />
        </div>
        <ProfilePhoto isOwnProfile={isOwnProfile} profile={profile} />
        {!isOwnProfile && <ProfileActionButtons />}
      </div>

      <div className="px-4">
        <h1 className="text-4xl font-bold mb-1">{profile?.name}</h1>
        <div className="flex flex-col lg:flex-row">
          <p className="text-lg text-gray-600 mr-4">@{profile?.id}</p>
          <div className="flex flex-row">
            <p className="text-lg mr-6 hidden lg:block">&bull;</p>
            <p className="text-lg mr-6 font-semibold">
              <span>0</span> <span className="text-gray-500">Followers</span>
            </p>
            <p className="text-lg mr-6">&bull;</p>
            <p className="text-lg font-semibold">
              <span>0</span> <span className="text-gray-500">Following</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
