'use client';

import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function Page() {
  const { showToast } = useToast();
  return (
    <>
      <h1 className="my-4 text-3xl font-bold">Edit Profile</h1>
      <Button
        onPress={() =>
          showToast({
            type: 'default',
            title: 'Default',
            message: 'Lorem ipsum dolor sit amet.',
          })
        }
      >
        Default
      </Button>
      <Button
        onPress={() =>
          showToast({
            type: 'success',
            title: 'Success',
            message: 'Lorem ipsum dolor sit amet.',
          })
        }
      >
        Success
      </Button>
      <Button
        onPress={() =>
          showToast({
            type: 'warning',
            title: 'Warning',
            message: 'Lorem ipsum dolor sit amet.',
          })
        }
      >
        Warning
      </Button>
      <Button
        onPress={() =>
          showToast({
            type: 'error',
            title: 'Error',
            message: 'Lorem ipsum dolor sit amet.',
          })
        }
      >
        Error
      </Button>
    </>
  );
}
