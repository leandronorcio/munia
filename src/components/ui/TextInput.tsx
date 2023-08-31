'use client';
import { cn } from '@/lib/cn';
import { SVGProps, forwardRef, useRef } from 'react';
import { AriaTextFieldProps, useTextField } from 'react-aria';

interface TextInputProps extends AriaTextFieldProps {
  className?: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, Icon, ...rest }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || localRef;
    const { errorMessage, label } = rest;
    const isError = errorMessage !== undefined;
    let { labelProps, inputProps, errorMessageProps } = useTextField(
      rest,
      localRef,
    );

    return (
      <>
        <div className="relative">
          {Icon && (
            <div className="absolute left-5 top-[50%] translate-y-[-50%]">
              <Icon
                className={cn(isError ? 'stroke-red-900' : 'stroke-gray-500')}
                width={24}
                height={24}
              />
            </div>
          )}
          <input
            {...inputProps}
            ref={inputRef}
            className={cn(
              'peer w-full rounded-2xl bg-slate-100 pb-2 pr-5 pt-8 outline-none ring-black focus:ring-2',
              Icon ? 'pl-16' : 'pl-5',
              isError && 'bg-red-200 ring-2 ring-red-900',
              className,
            )}
            placeholder=" "
          />
          <label
            className={cn(
              'absolute top-[9px] z-0 translate-y-0 cursor-text text-sm transition-all peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm',
              Icon ? 'left-16' : 'left-5',
              isError ? 'text-red-900' : 'text-gray-500',
            )}
            {...labelProps}
          >
            {label}
          </label>
        </div>
        {isError && (
          <p className="mt-2 font-semibold text-red-800" {...errorMessageProps}>
            {errorMessage}
          </p>
        )}
      </>
    );
  },
);
