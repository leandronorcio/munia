'use client';
import Button from '@/components/ui/Button';
import { CountContext } from '@/contexts/CountContext';
import { useContext, useState } from 'react';

export default function Messages() {
  const [loading, setLoading] = useState(false);
  const toggleLoading = () => setLoading((prev) => !prev);
  const message = 'lasl';
  return (
    <div className="p-4 pt-2">
      <Button
        mode="secondary"
        size="small"
        loading={loading}
        onClick={toggleLoading}
      >
        Submit
      </Button>
    </div>
  );
}
