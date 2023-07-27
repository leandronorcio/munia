import Button from '@/components/ui/Button';
import { useSessionUserDataMutation } from '@/hooks/mutations/useSessionUserDataMutation';
import { Delete, Edit } from '@/svg_components';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormEvent, cloneElement, useState } from 'react';

/**
 * Create an object type using the keys of `User`,
 * populate each property with `HTMLInputElement`.
 * This will be used to type the elements of
 * the uncontrolled <Form> element.
 */
type FormElements = Record<keyof User, HTMLInputElement>;

export function AboutItem({
  field,
  value,
  label,
  children,
  isOwnProfile,
}: {
  field: keyof User;
  value?: string | null;
  label: string;
  children: React.ReactElement;
  isOwnProfile: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateSessionUserDataMutation } = useSessionUserDataMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as unknown as FormElements;

    // Get the value of the input
    let value = target[field].value;

    if (field === 'relationshipStatus' || field === 'gender') {
      value = value.toUpperCase().replace(/ /g, '_');
    }

    updateSessionUserDataMutation.mutate(
      {
        field,
        value,
      },
      {
        onSuccess: (updatedField) => {
          const updatedProperty = Object.entries(updatedField)[0][0];
          if (updatedProperty === 'username') {
            router.replace(`/${updatedField[updatedProperty]}/about`);
            return;
          }
          setIsEditing(false);
        },
      },
    );
  };

  const setToNull = async () => {
    updateSessionUserDataMutation.mutate({
      field,
      value: null,
    });
  };

  return (
    <div className="mb-2">
      <div className="mb-2 flex items-center gap-3">
        <h3 className="text-xl font-semibold text-gray-600">{label}</h3>
        {isOwnProfile && !isEditing && (
          <>
            <Edit
              className="cursor-pointer stroke-gray-600 hover:stroke-black"
              onClick={() => setIsEditing(true)}
            />
            {value &&
              ['username', 'name', 'email'].includes(field) === false && (
                <Delete
                  onClick={setToNull}
                  className="cursor-pointer stroke-gray-600 hover:stroke-black"
                />
              )}
          </>
        )}
      </div>
      {!isEditing ? (
        <p className="pl-4 text-lg">{value || 'Not set'}</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-4"
        >
          {/* Pass the `error` prop to the <TextInput> element. */}
          {cloneElement(children, {
            error:
              updateSessionUserDataMutation.error
                ?.toString()
                .replace('Error: ', '') || undefined,
          })}
          <div className="flex w-[320px] justify-end gap-2">
            <Button
              type="submit"
              size="small"
              loading={updateSessionUserDataMutation.isLoading}
            >
              Save
            </Button>
            <Button
              type="button"
              size="small"
              mode="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
