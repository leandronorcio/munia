import { getServerSession } from 'next-auth';
import Navbar from './Navbar';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { cn } from '@/lib/cn';

export default async function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <div
      className={cn(
        session && 'h-screen flex flex-col md:flex-row bg-violet-100'
      )}
    >
      {session && <Navbar />}
      {children}
    </div>
  );
}
