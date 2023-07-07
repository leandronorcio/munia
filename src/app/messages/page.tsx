'use client';
import Button from '@/components/ui/Button';
import { DateInput } from '@/components/ui/DateInput';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { TextInput } from '@/components/ui/TextInput';
import { CircleActionsSuccess, Search } from '@/svg_components';
import { useState } from 'react';

export default function Messages() {
  const [selectValue, setSelectValue] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  return (
    <>
      <DropdownMenu
        width="100%"
        trigger={
          <Button mode="subtle" shape="pill">
            Gender
          </Button>
        }
      >
        <DropdownItem>Male</DropdownItem>
        <DropdownItem active={true}>Female</DropdownItem>
      </DropdownMenu>
      <DropdownMenu
        width="100%"
        trigger={
          <Button mode="subtle" shape="pill">
            Relationship Status
          </Button>
        }
      >
        <DropdownItem>Single</DropdownItem>
        <DropdownItem active={true}>Married</DropdownItem>
      </DropdownMenu>
    </>
  );
}
