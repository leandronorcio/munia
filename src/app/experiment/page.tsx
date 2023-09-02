'use client';

import Button from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import SvgAtSign from '@/svg_components/AtSign';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState('');
  const { showToast } = useToast();
  console.log('rendered experiment');
  return (
    <div className="mt-5">
      <DatePicker label="Birth date" />
      <br />
      <Textarea
        Icon={SvgAtSign}
        label="Enter Bio"
        value={value}
        onChange={setValue}
      />
      <Button
        onPress={() =>
          showToast({
            title: 'Success',
            message:
              "How can we not talk about family, when family's all we got?",
          })
        }
      >
        Show with Message Toast
      </Button>
      <Button
        onPress={() =>
          showToast({
            title: 'Success',
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
