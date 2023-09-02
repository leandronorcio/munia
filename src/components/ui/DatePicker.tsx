import { RefCallback, useRef } from 'react';
import { useDatePickerState } from 'react-stately';
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria';
import { Calendar } from './Calendar';
import { DateField } from './DateField';
import { Popover } from './Popover';
import SvgCalendar from '@/svg_components/Calendar';
import { ButtonNaked } from './ButtonNaked';
import { DatePickerDialog } from './DatePickerDialog';
import { cn } from '@/lib/cn';

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  /**
   * Expose the button trigger to the parent component using a `RefCallback`,
   * this is useful for programmatic focusing, e.g. allows `react-hook-form`
   * to focus the date picker when there is an input error.
   */
  triggerRef: RefCallback<HTMLButtonElement>;
}

export function DatePicker({ triggerRef, ...props }: DatePickerProps) {
  let state = useDatePickerState(props);
  let ref = useRef(null);
  let {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
    errorMessageProps,
  } = useDatePicker(props, state, ref);
  const isError = props.errorMessage !== undefined;
  // For clearing value: https://github.com/adobe/react-spectrum/issues/4986

  return (
    <>
      <div
        className={cn(
          'relative flex-col rounded-2xl bg-slate-100 pb-2 pr-5 pt-8 text-left outline-none ring-black focus-within:ring-2',
          isError && 'bg-red-200 ring-red-900',
        )}
      >
        <span
          {...labelProps}
          className={cn(
            'absolute left-16 top-[9px] text-sm',
            isError ? 'text-red-900' : 'text-gray-500',
          )}
        >
          {props.label}
        </span>

        <ButtonNaked
          {...buttonProps}
          ref={(node) => triggerRef(node)}
          className="absolute left-5 top-[50%] translate-y-[-50%]"
        >
          <SvgCalendar className="h-6 w-6 stroke-gray-500 hover:stroke-black group-focus-within:stroke-black" />
        </ButtonNaked>
        <div {...groupProps} ref={ref} className="group ml-16 flex">
          <div className="relative flex items-center rounded-md border border-gray-200 p-1 transition-colors group-focus-within:border-black group-hover:border-gray-400 group-focus-within:group-hover:border-black">
            <DateField {...fieldProps} />
            {/* {state.validationState === 'invalid' && (
            <Close className="absolute right-1 h-6 w-6 text-red-500" />
          )} */}
          </div>
        </div>
        {state.isOpen && (
          <Popover triggerRef={ref} state={state} placement="bottom start">
            <DatePickerDialog {...dialogProps}>
              <Calendar {...calendarProps} />
            </DatePickerDialog>
          </Popover>
        )}
      </div>
      {isError && (
        <p className="mt-2 font-semibold text-red-800" {...errorMessageProps}>
          {props.errorMessage}
        </p>
      )}
    </>
  );
}
