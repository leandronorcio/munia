'use client';

import { Calendar } from '@/components/ui/Calendar';
import { DatePicker } from '@/components/ui/DatePicker';
import { TextInput } from '@/components/ui/TextInput';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState(parseDate('2015-02-03'));
  return (
    <div className="mt-5">
      <DatePicker label="Birth date" />
      <br />
      <TextInput label="Name" errorMessage="Shut the fck up" />
    </div>
  );
}
