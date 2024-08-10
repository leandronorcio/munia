'use client';

import { Select } from '@/components/ui/Select';
import { Gender, RelationshipStatus } from '@prisma/client';
import { kebabCase, lowerCase, snakeCase, startCase, toUpper } from 'lodash';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Item } from 'react-stately';
import { DiscoverFilterKeys, DiscoverFilters as TDiscoverFilters } from '@/types/definitions';
import { Key, useCallback } from 'react';

export function DiscoverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = {
    gender: searchParams.get('gender') || undefined,
    relationshipStatus: searchParams.get('relationship-status') || undefined,
  };
  const genderFilters: Gender[] = ['MALE', 'FEMALE', 'NONBINARY'];
  const relationshipStatusFilters: RelationshipStatus[] = ['SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED'];

  const updateParams = useCallback(
    <T extends DiscoverFilterKeys>({ key, value }: { key: T; value: TDiscoverFilters[T] }) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, kebabCase(value));
      }

      const url = `${pathname}?${newSearchParams.toString()}`;
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const onSelectGender = useCallback(
    (value: Key) => {
      updateParams({
        key: 'gender',
        value: value as TDiscoverFilters['gender'],
      });
    },
    [updateParams],
  );
  const onSelectRelationshipStatus = useCallback(
    (value: Key) => {
      updateParams({
        key: 'relationship-status',
        value: value as TDiscoverFilters['relationship-status'],
      });
    },
    [updateParams],
  );

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Select
          label="Filter by Gender"
          selectedKey={toUpper(snakeCase(filters.gender)) || null}
          onSelectionChange={onSelectGender}>
          {genderFilters.map((gender) => (
            <Item key={gender}>{startCase(lowerCase(gender))}</Item>
          ))}
        </Select>
      </div>
      <div className="flex-1">
        <Select
          label="Filter by Status"
          selectedKey={toUpper(snakeCase(filters.relationshipStatus)) || null}
          onSelectionChange={onSelectRelationshipStatus}>
          {relationshipStatusFilters.map((relationship) => (
            <Item key={relationship}>{startCase(lowerCase(relationship))}</Item>
          ))}
        </Select>
      </div>
    </div>
  );
}
