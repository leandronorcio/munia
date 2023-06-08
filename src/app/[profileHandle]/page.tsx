import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ProfileActionButtons } from './ProfileActionButtons';
import { PrismaClient } from '@prisma/client';
import { EditCoverPhotoButton } from './EditCoverPhotoButton';
import { EditProfilePhotoButton } from './EditProfilePhotoButton';
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

  if (!session) return redirect('/');
  const profile = await getProfile(params.profileHandle);
  const isOwnProfile = profile?.id === session.user?.id;
  console.log(isOwnProfile);

  return (
    <div>
      <div className="relative mb-28">
        <div className="h-72 bg-violet-300 rounded-3xl">
          {isOwnProfile && <EditCoverPhotoButton />}
        </div>
        <div className="absolute -bottom-24 bg-red-200 w-48 h-48 rounded-full  border-8 border-white">
          {isOwnProfile && <EditProfilePhotoButton />}
        </div>
        {!isOwnProfile && <ProfileActionButtons />}
      </div>
      <h1 className="text-4xl font-bold mb-1">{profile?.name}</h1>
      <div className="flex flex-row">
        <p className="text-lg text-gray-600 mr-4">@{profile?.id}</p>
        <p className="text-lg mr-6">&bull;</p>
        <p className="text-lg mr-6 font-semibold">
          <span>0</span> <span className="text-gray-500">Followers</span>
        </p>
        <p className="text-lg mr-6">&bull;</p>
        <p className="text-lg font-semibold">
          <span>0</span> <span className="text-gray-500">Following</span>
        </p>
      </div>
    </div>
  );
}
