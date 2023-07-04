'use client';
import { DateInput } from '@/components/ui/DateInput';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import { Search } from '@/svg_components';
import { useState } from 'react';

export default function Messages() {
  const [selectValue, setSelectValue] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  return (
    <>
      <TextInput placeholder="Search" Icon={Search} />
      <br />
      <TextInput placeholder="Email" type="email" />
      <br />
      <Select
        options={['Apple', 'Samsung', 'Oppo']}
        value={selectValue}
        onChange={(value) => setSelectValue(value)}
        placeholder="Enter manufacturer"
      />
      <br />
      <DateInput value={date} onChange={(date) => setDate(date)} />
    </>
  );
}
