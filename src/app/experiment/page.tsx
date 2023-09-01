'use client';

import Button from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import { parseDate } from '@internationalized/date';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState(parseDate('2015-02-03'));
  const { showToast } = useToast();
  console.log('rendered experiment');
  return (
    <div className="mt-5">
      <DatePicker label="Birth date" />
      <br />
      <TextInput label="Name" errorMessage="Shut the fck up" />
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
