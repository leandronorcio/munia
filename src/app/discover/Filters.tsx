'use client';
import Button from '@/components/ui/Button';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { deleteSearchParams } from '@/lib/deleteSearchParams';
import { kebabToNormal } from '@/lib/kebabToNormal';
import { updateSearchParams } from '@/lib/updateSearchParams';
import { useRouter, useSearchParams } from 'next/navigation';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFilters = {
    gender: searchParams.get('gender'),
    relationshipStatus: searchParams.get('relationship-status'),
  };
  const updateParams = ({
    title,
    value,
  }: {
    title: string;
    value: string | null;
  }) => {
    const newPathName =
      value !== null
        ? updateSearchParams(title, value.toLowerCase())
        : deleteSearchParams(title);

    router.push(newPathName);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu
        width="115%"
        trigger={
          <Button mode="subtle" shape="pill">
            Gender: <b>{kebabToNormal(selectedFilters.gender) || 'All'}</b>
          </Button>
        }
      >
        <DropdownItem
          onClick={() => updateParams({ title: 'gender', value: null })}
        >
          Clear
        </DropdownItem>
        {['male', 'female', 'nonbinary'].map((gender) => {
          return (
            <DropdownItem
              key={gender}
              onClick={() => updateParams({ title: 'gender', value: gender })}
            >
              {kebabToNormal(gender)}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
      <DropdownMenu
        width="100%"
        trigger={
          <Button mode="subtle" shape="pill">
            Relationship Status:{' '}
            <b>{kebabToNormal(selectedFilters.relationshipStatus) || 'All'}</b>
          </Button>
        }
      >
        <DropdownItem
          onClick={() =>
            updateParams({ title: 'relationship-status', value: null })
          }
        >
          Clear
        </DropdownItem>
        {['single', 'in-a-relationship', 'engaged', 'married'].map(
          (relationship) => {
            return (
              <DropdownItem
                key={relationship}
                onClick={() =>
                  updateParams({
                    title: 'relationship-status',
                    value: relationship,
                  })
                }
              >
                {kebabToNormal(relationship)}
              </DropdownItem>
            );
          }
        )}
      </DropdownMenu>
    </div>
  );
}
