import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ProfileActionButtons } from './ProfileActionButtons';

export default async function Page({
  params,
}: {
  params: { profileHandle: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect('/');
  const user = session.user;

  return (
    <div>
      <div className="relative mb-28">
        <div className="h-72 bg-violet-300 rounded-3xl"></div>
        <div className="absolute -bottom-24 bg-red-200 w-48 h-48 rounded-full  border-8 border-white"></div>
        <ProfileActionButtons />
      </div>
      <h1 className="text-4xl font-bold mb-1">{user?.name}</h1>
      <div className="flex flex-row">
        <p className="text-lg text-gray-600 mr-4">@{user?.id}</p>
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
