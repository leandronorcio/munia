import type { AriaSelectProps } from '@react-types/select';
import { useSelectState } from 'react-stately';
import { useSelect, HiddenSelect, useButton } from 'react-aria';
import { ListBox } from './SelectListBox';
import { Popover } from './Popover';
import { ForwardedRef, SVGProps, forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useObjectRef } from '@react-aria/utils';

interface SelectProps<T> extends AriaSelectProps<T> {
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Select = forwardRef(function Select<T extends {}>(
  { Icon, ...props }: SelectProps<T>,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  // Create state based on the incoming props
  const state = useSelectState(props);

  // Get props for child elements from useSelect
  const ref = useObjectRef(forwardedRef);
  const { labelProps, triggerProps, valueProps, menuProps, errorMessageProps } =
    useSelect(props, state, ref);

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);
  const isThereASelectedValue = state.selectedItem;

  const { label, name, errorMessage } = props;
  const isError = errorMessage !== undefined;

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

        <div
          {...labelProps}
          className={cn(
            'absolute left-5 cursor-pointer text-gray-500 transition-all',
            isThereASelectedValue
              ? 'top-[9px] translate-y-0 text-sm'
              : 'top-[50%] translate-y-[-50%] text-lg',
            Icon ? 'left-16' : 'left-5',
            isError ? 'text-red-900' : 'text-gray-500',
          )}
          onClick={() => state.open()}
        >
          {label}
        </div>
        <HiddenSelect
          state={state}
          triggerRef={ref}
          label={label}
          name={name}
        />
        <button
          {...buttonProps}
          ref={ref}
          className={cn(
            'w-full rounded-2xl bg-slate-100 pb-2 pl-5 pr-5 pt-8 text-left outline-none ring-black focus:ring-2',
            Icon ? 'pl-16' : 'pl-5',
            isError && 'bg-red-200 ring-red-900',
          )}
        >
          <span
            {...valueProps}
            // Visually hide the 'Select an option' text
            className={cn(!isThereASelectedValue && 'text-transparent')}
          >
            {isThereASelectedValue
              ? state.selectedItem.rendered
              : 'Select an option'}
          </span>
        </button>
        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={ref}
            placement="bottom start"
            className="min-w-[200px]"
          >
            <ListBox {...menuProps} state={state} />
          </Popover>
        )}
      </div>
      {isError && (
        <p className="mt-2 font-semibold text-red-800" {...errorMessageProps}>
          {errorMessage}
        </p>
      )}
    </>
  );
});
