// https://stackoverflow.com/questions/40731352/extending-html-elements-in-react-and-typescript-while-preserving-props
'use client';

import { cn } from '@/lib/cn';
import { forwardRef, useRef } from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // put custom props here
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || localRef;

    return (
      <textarea
        ref={textareaRef}
        onInput={(e) => {
          const textarea = e.target as HTMLTextAreaElement;

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
);
