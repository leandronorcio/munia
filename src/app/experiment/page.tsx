'use client';

import { Item, Select } from '@/components/ui/Select';
import { Section } from 'react-stately';

export default function Page() {
  return (
    <div className="mt-5">
      <Select label="Favorite Animal" disabledKeys={['cat']}>
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Section title="Unique Animals">
          <Item key="aardvark">Aardvark</Item>
          <Item key="kangaroo">Kangaroo</Item>
        </Section>
        <Item key="snake">Snake</Item>
      </Select>
    </div>
  );
}
