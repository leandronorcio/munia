'use client';
import { Select } from '@/components/ui/Select';
import { Gender, RelationshipStatus } from '@prisma/client';
import { kebabCase, lowerCase, snakeCase, startCase, toUpper } from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Item } from 'react-stately';
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Select
          label="Filter by Gender"
          selectedKey={toUpper(snakeCase(filters.gender)) || null}
          onSelectionChange={(key) => {
            updateParams({
              title: 'gender',
              value: (key as Gender) || undefined,
            });
          }}
        >
          {genderFilters.map((gender) => {
            return <Item key={gender}>{startCase(lowerCase(gender))}</Item>;
          })}
        </Select>
      </div>
      <div className="flex-1">
        <Select
          label="Filter by Status"
          selectedKey={toUpper(snakeCase(filters.relationshipStatus)) || null}
          onSelectionChange={(key) => {
            updateParams({
              title: 'relationship-status',
              value: (key as RelationshipStatus) || undefined,
            });
          }}
        >
          {relationshipStatusFilters.map((relationship) => {
            return (
              <Item key={relationship}>
                {startCase(lowerCase(relationship))}
              </Item>
            );
          })}
        </Select>
      </div>
    </div>
  );
}
