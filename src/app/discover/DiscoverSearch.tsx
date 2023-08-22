'use client';
import { TextInput } from '@/components/ui/TextInput';
import SvgSearch from '@/svg_components/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEventHandler, useState } from 'react';

export function DiscoverSearch({
  label = 'Search People',
}: {
  label?: string;
}) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (search === '') {
      params.delete('search');
    } else {
      params.set('search', search);
    }

    const url = `${pathname}?${params.toString()}`;
    router.push(url);
  };

  return (
    <div className="sticky top-4 z-[1] mb-4">
      <form onSubmit={handleSubmit}>
        <TextInput
          value={search}
          onChange={(text) => setSearch(text)}
          label={label}
          width="100%"
          Icon={SvgSearch}
          errorMessage={error === '' ? undefined : error}
        />
      </form>
    </div>
  );
}
