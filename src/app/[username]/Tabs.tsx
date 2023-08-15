'use client';

import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from 'next/navigation';

export default function Tabs({ isOwnProfile }: { isOwnProfile: boolean }) {
  const selectedSegment = useSelectedLayoutSegment();
  const parentLayoutSegment = `/${usePathname().split('/')[1]}`;

  return (
    <div className="mt-6 flex flex-row gap-6">
      {[
        { title: 'Posts', segment: parentLayoutSegment },
        { title: 'Photos', segment: `${parentLayoutSegment}/photos` },
        { title: 'About', segment: `${parentLayoutSegment}/about` },
        ...[
          isOwnProfile
            ? { title: 'Activity', segment: `${parentLayoutSegment}/activity` }
            : undefined,
        ],
      ].map((item) => {
        if (!item) return;
        const { title, segment } = item;
        return (
          <TabItem
            segment={segment}
            isActive={
              (selectedSegment === null
                ? parentLayoutSegment
                : `${parentLayoutSegment}/${selectedSegment}`) === segment
            }
            key={segment}
          >
            {title}
          </TabItem>
        );
      })}
    </div>
  );
}

function TabItem({
  children,
  segment,
  isActive,
}: {
  children: React.ReactNode;
  segment: string;
  isActive: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className="mb-2 flex cursor-pointer flex-col items-center gap-2 py-4"
      onClick={() => {
        router.push(segment);
      }}
    >
      <h2
        className={cn(
          'text-xl font-semibold',
          isActive ? 'text-black' : 'text-gray-500 hover:text-gray-700',
        )}
      >
        {children}
      </h2>
      {isActive && <Ellipse width={8} height={8} />}
    </div>
  );
}
