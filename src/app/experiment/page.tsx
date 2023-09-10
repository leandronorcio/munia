'use client';

import { LoadingPage } from '@/components/LoadingPage';
import Button from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

export default function Page() {
  const [bool, setBool] = useState(false);

  return (
    <div className="mt-10">
      <LoadingPage />
    </div>
  );
}
