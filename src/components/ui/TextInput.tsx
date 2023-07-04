import { cn } from '@/lib/cn';
import { SVGProps, forwardRef, useRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ placeholder, Icon, ...rest }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || localRef;

    return (
      <label className="relative block">
        {Icon && (
          <div className="absolute top-[50%] translate-y-[-50%] left-5">
            <Icon className="stroke-gray-500" width={24} height={24} />
          </div>
        )}
        <input
          {...rest}
          className={cn(
            'w-[320px] pt-8 pb-2 pr-5 bg-slate-100 outline-none rounded-2xl focus:ring-2 ring-black peer',
            Icon ? 'pl-16' : 'pl-5'
          )}
          placeholder=" "
          ref={inputRef}
        />
        <div
          className={cn(
            'cursor-text absolute z-0 transition-all text-gray-500 top-[9px] translate-y-0 text-sm peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg',
            Icon ? 'left-16' : 'left-5'
          )}
        >
          {placeholder}
        </div>
      </label>
    );
  }
);
