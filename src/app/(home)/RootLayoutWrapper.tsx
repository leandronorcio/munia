import { getServerSession } from 'next-auth';
import Sidebar from './Sidebar';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { cn } from '@/lib/cn';
import Navbar from './Navbar';
import { BottomMenu } from './BottomMenu';

export default async function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <div className="h-screen flex flex-col bg-violet-100">
      {session && <Navbar />}
      {session ? (
        <div className="h-full w-full flex flex-col md:flex-row">
          {session && <Sidebar />}
          <div className="bg-green-200 flex-grow flex justify-center">
            <div className="w-full lg:w-[850px] xl:w-[950px]">{children}</div>
          </div>
          {session && <BottomMenu />}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
