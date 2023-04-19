import { cn } from '@/lib/cn';
import Image from 'next/image';

export default function SidebarMenuItem({
  src,
  children,
  className,
}: {
  src: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn([
        'flex flex-row items-center h-14 p-6 w-52 rounded-xl cursor-pointer relative group hover:bg-violet-200 duration-300',
        className,
      ])}
    >
      <div className="w-[6px] h-10 scale-0 group-hover:scale-100 transition-transform duration-300 bg-violet-700 absolute left-[-32px] rounded-r-md"></div>
      <Image src={src} alt={src} width={24} height={24} className="mr-4" />{' '}
      <span className="text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700">
        {children}
      </span>
    </div>
  );
}
