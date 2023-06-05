import { getServerSession } from 'next-auth';
import Sidebar from './Sidebar';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { cn } from '@/lib/cn';
import Navbar from './Navbar';

export default async function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <div className="h-screen flex flex-col bg-violet-100">
      {session && <Navbar />}
      <div className={cn(session && 'h-full flex flex-col md:flex-row')}>
        {session && <Sidebar />}
        {children}
      </div>
    </div>
  );
}
