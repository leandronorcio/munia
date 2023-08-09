// https://stackoverflow.com/questions/40731352/extending-html-elements-in-react-and-typescript-while-preserving-props
'use client';
import { cn } from '@/lib/cn';
import { forwardRef, useEffect, useRef } from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // put custom props here
  filled?: boolean;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ filled = false, error, ...rest }, parentRef) => {
    const localRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const textarea = localRef.current;
      if (textarea === null) return;
      resizeTextAreaHeight(textarea);
    }, [localRef.current]);

    return (
      <>
        <textarea
          ref={(el: HTMLTextAreaElement) => {
            if (typeof parentRef === 'function') parentRef(el);
            else if (parentRef !== null) parentRef.current = el;
            localRef.current = el;
          }}
          onInput={(e) => {
            const textarea = e.target as HTMLTextAreaElement;
            resizeTextAreaHeight(textarea);
          }}
          {...rest}
          className={cn(
            'block w-full resize-none overflow-hidden bg-transparent text-lg outline-none',
            error && 'bg-red-200 ring-2 ring-red-900 placeholder:text-red-900',
            rest.className,
          )}
          rows={1}
        />
        {error && <p className="mt-2 font-semibold text-red-800">{error}</p>}
      </>
    );
  },
);

export const resizeTextAreaHeight = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};
