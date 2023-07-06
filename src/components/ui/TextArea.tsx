// https://stackoverflow.com/questions/40731352/extending-html-elements-in-react-and-typescript-while-preserving-props
'use client';
import { cn } from '@/lib/cn';
import { forwardRef, useRef } from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // put custom props here
  filled?: boolean;
  error?: string;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ filled = false, error, ...rest }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || localRef;

    return (
      <div>
        <textarea
          ref={textareaRef}
          onInput={(e) => {
            const textarea = e.target as HTMLTextAreaElement;

            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }}
          {...rest}
          className={cn(
            'w-full  outline-none px-4 py-0 text-lg overflow-hidden resize-none',
            filled ? 'p-5 rounded-2xl bg-slate-100' : 'bg-transparent',
            error && 'bg-red-200 ring-2 ring-red-900 placeholder:text-red-900',
            rest.className
          )}
          rows={1}
        />
        {error && <p className="text-red-800 font-semibold mt-2">{error}</p>}
      </div>
    );
  }
);
