'use client';

import { GenericLoading } from '@/components/GenericLoading';
import { useState } from 'react';

export default function Page() {
  const [bool, setBool] = useState(false);

  return (
    <div className="mt-10">
      <GenericLoading />
    </div>
  );
}
