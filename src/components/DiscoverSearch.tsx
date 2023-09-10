'use client';

import { TextInput } from '@/components/ui/TextInput';
import SvgSearch from '@/svg_components/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function DiscoverSearch({
  label = 'Search People',
}: {
  label?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search === '') {
      params.delete('search');
    } else {
      params.set('search', search);
    }

    const url = `${pathname}?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  return (
    <div className="sticky top-4 z-[2] mb-4">
      <TextInput onChange={handleChange} label={label} Icon={SvgSearch} />
    </div>
  );
}
