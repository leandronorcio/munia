import Button from '@/components/ui/Button';
import { Delete, Edit } from '@/svg_components';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, cloneElement, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-expect-error
    let value = e.target[field].value;
    if (value === '' || value === null)
      return setError(`${label} cannot be empty.`);

    if (field === 'relationshipStatus' || field === 'gender') {
      value = value.toUpperCase().replace(/ /g, '_');
    }

    const res = await fetch(`/api/users/${session?.user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (res.ok) {
      update();
      setIsEditing(false);
      const { id } = (await res.json()) as User;
      if (field === 'id') {
        router.replace(`/${id}/about`);
        return;
      }
      if (field === 'name') router.refresh();
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  const setToNull = async () => {
    const res = await fetch(`/api/users/${session?.user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: null }),
    });

    if (res.ok) {
      update();
    }
  };

  return (
    <div className="mb-2">
      <h3 className="font-semibold text-xl text-gray-600 mb-2">{label}</h3>
      <div className="flex items-center gap-4">
        {!isEditing ? (
          <h6 className="text-lg pl-4">{value || 'Not set'}</h6>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-start gap-4">
            {cloneElement(children, { error })}
            <Button type="submit">Save</Button>
            <Button
              type="button"
              mode="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </form>
        )}
        {isOwnProfile && !isEditing && (
          <>
            <Edit
              className="stroke-gray-600 hover:stroke-black cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
            {value && ['id', 'name', 'email'].includes(field) === false && (
              <Delete
                onClick={setToNull}
                className="stroke-gray-600 hover:stroke-black cursor-pointer"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
