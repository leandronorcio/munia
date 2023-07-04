'use client';
import { TextInput } from '@/components/ui/TextInput';
import { Search } from '@/svg_components';

export default function Messages() {
  return (
    <>
      <TextInput placeholder="Search" Icon={Search} />
      <br />
      <TextInput placeholder="Name" />
    </>
  );
}
