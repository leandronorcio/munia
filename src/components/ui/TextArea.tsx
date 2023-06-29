// https://stackoverflow.com/questions/40731352/extending-html-elements-in-react-and-typescript-while-preserving-props
'use client';

import { cn } from '@/lib/cn';
import { useRef } from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // put custom props here
}
export default function TextArea({ ...props }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <textarea
      ref={textareaRef}
      onInput={() => {
        const textarea = textareaRef.current;
        if (textarea === null) return;

        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }}
      {...props}
      className={cn(
        'w-full bg-transparent outline-none px-4 py-0 text-lg overflow-hidden resize-none',
        props.className
      )}
      rows={1}
    />
  );
}
