'use client';
import { BasicModalContext } from '@/contexts/BasicModalContext';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext } from 'react';

export default function Messages() {
  const { alert, confirm } = useContext(BasicModalContext);
  const { toastify } = useContext(ToastContext);

  return (
    <>
      <h1>Messages</h1>
      <button
        onClick={() => alert({ title: 'Alert', message: 'Hello there mate.' })}
      >
        Alert
      </button>
      <button
        onClick={() =>
          confirm({
            title: 'Testing',
            message: 'Hello there mate.',
            actionOnConfirm: () => {
              console.log('confirmed');
            },
          })
        }
      >
        Confirm
      </button>
      <button
        onClick={() =>
          toastify({
            title: 'Successfully updated.',
            type: 'success',
          })
        }
      >
        Show Toast
      </button>
    </>
  );
}
