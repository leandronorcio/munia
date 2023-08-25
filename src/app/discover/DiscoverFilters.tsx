'use client';
import { Item, Select } from '@/components/ui/Select';
import { kebabCase, lowerCase, snakeCase, startCase, toUpper } from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { DiscoverFilters } from 'types';

export function DiscoverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = {
    gender: searchParams.get('gender') || undefined,
    relationshipStatus: searchParams.get('relationship-status') || undefined,
  };
  const genderFilters: DiscoverFilters['gender'][] = [
    'MALE',
    'FEMALE',
    'NONBINARY',
  ];
  const relationshipStatusFilters: DiscoverFilters['relationshipStatus'][] = [
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED',
  ];

  const updateParams = ({
    title,
    value,
  }: {
    title: string;
    value: DiscoverFilters[keyof DiscoverFilters];
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value === undefined) {
      newSearchParams.delete(title);
    } else {
      newSearchParams.set(title, kebabCase(value));
    }

    const url = `${pathname}?${newSearchParams.toString()}`;
    router.push(url, { scroll: false });
  };

  return (
    <div className="mb-6 flex  gap-4">
      <Select
        label="Filter by Gender"
        selectedKey={toUpper(snakeCase(filters.gender)) || 'ALL'}
        onSelectionChange={(key) => {
          const value = (
            key === 'ALL' ? undefined : key
          ) as DiscoverFilters['gender'];
          updateParams({
            title: 'gender',
            value: value,
          });
        }}
      >
        {['ALL', ...genderFilters].map((gender) => {
          return <Item key={gender}>{startCase(lowerCase(gender))}</Item>;
        })}
      </Select>
      <Select
        label="Filter by Status"
        selectedKey={toUpper(snakeCase(filters.relationshipStatus)) || 'ALL'}
        onSelectionChange={(key) => {
          const value = (
            key === 'ALL' ? undefined : key
          ) as DiscoverFilters['relationshipStatus'];
          updateParams({
            title: 'relationship-status',
            value: value,
          });
        }}
      >
        {['ALL', ...relationshipStatusFilters].map((relationship) => {
          return (
            <Item key={relationship}>{startCase(lowerCase(relationship))}</Item>
          );
        })}
      </Select>
    </div>
  );
}
