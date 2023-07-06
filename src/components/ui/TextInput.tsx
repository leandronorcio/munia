'use client';
import { cn } from '@/lib/cn';
import { SVGProps, forwardRef, useRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  error?: string;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ placeholder, Icon, error, ...rest }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || localRef;

    return (
      <div>
        <label className="relative block">
          {Icon && (
            <div className="absolute top-[50%] translate-y-[-50%] left-5">
              <Icon
                className={cn(error ? 'stroke-red-900' : 'stroke-gray-500')}
                width={24}
                height={24}
              />
            </div>
          )}
          <input
            {...rest}
            className={cn(
              'w-[320px] pt-8 pb-2 pr-5 outline-none rounded-2xl focus:ring-2 ring-black peer',
              Icon ? 'pl-16' : 'pl-5',
              error ? 'bg-red-200 ring-2 ring-red-900' : 'bg-slate-100'
            )}
            placeholder=" "
            ref={inputRef}
          />
          <div
            className={cn(
              'absolute z-0 transition-all top-[9px] translate-y-0 text-sm peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg cursor-text',
              Icon ? 'left-16' : 'left-5',
              error ? 'text-red-900' : 'text-gray-500'
            )}
          >
            {placeholder}
          </div>
        </label>
        {error && <p className="text-red-800 font-semibold mt-2">{error}</p>}
      </div>
    );
  }
);
