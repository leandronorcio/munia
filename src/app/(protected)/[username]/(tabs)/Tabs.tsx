'use client';

import { TabButton } from '@/components/TabButton';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

export default function Tabs({ isOwnProfile }: { isOwnProfile: boolean }) {
  const selectedSegment = useSelectedLayoutSegment();
  const parentLayoutSegment = `/${usePathname().split('/')[1]}`;

  return (
    <div className="mt-4 inline-flex flex-row gap-6 overflow-x-auto border-b-[1px] border-muted">
      {[
        { title: 'Posts', segment: parentLayoutSegment },
        { title: 'Photos', segment: `${parentLayoutSegment}/photos` },
        { title: 'About', segment: `${parentLayoutSegment}/about` },
        ...[isOwnProfile ? { title: 'Activity', segment: `${parentLayoutSegment}/activity` } : undefined],
      ].map((item) => {
        if (!item) return null;
        const { title, segment } = item;
        const isActive =
          (selectedSegment === null ? parentLayoutSegment : `${parentLayoutSegment}/${selectedSegment}`) === segment;
        return <TabButton key={segment} title={title} isActive={isActive} href={segment} />;
      })}
    </div>
  );
}
