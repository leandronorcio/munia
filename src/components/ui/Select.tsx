import type { AriaSelectProps } from '@react-types/select';
import { useSelectState } from 'react-stately';
import { useSelect, HiddenSelect, useButton } from 'react-aria';

import { ListBox } from './SelectListBox';
import { Popover } from './Popover';
import { useRef } from 'react';
import { cn } from '@/lib/cn';

export { Item } from 'react-stately';

export function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  const state = useSelectState(props);

  // Get props for child elements from useSelect
  const ref = useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref,
  );

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);
  const isThereASelectedValue = state.selectedItem;

  return (
    <div className="relative w-full">
      <div
        {...labelProps}
        className={cn(
          'absolute left-5 cursor-pointer text-gray-500 transition-all',
          isThereASelectedValue
            ? 'top-[9px] translate-y-0 text-sm'
            : 'top-[50%] translate-y-[-50%] text-lg',
        )}
        onClick={() => state.open()}
      >
        {props.label}
      </div>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...buttonProps}
        ref={ref}
        className={cn(
          'w-full rounded-2xl bg-slate-100 pb-2 pl-5 pr-5 pt-8 text-left outline-none ring-black focus:ring-2',
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
  );
}
