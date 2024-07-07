import { RefCallback, useCallback, useRef } from 'react';
import { useDatePickerState } from 'react-stately';
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria';
import SvgCalendar from '@/svg_components/Calendar';
import { cn } from '@/lib/cn';
import SvgClose from '@/svg_components/Close';
import { Calendar } from './Calendar';
import { DateField } from './DateField';
import { Popover } from './Popover';
import { ButtonNaked } from './ButtonNaked';
import { DatePickerDialog } from './DatePickerDialog';
import Button from './Button';

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  /**
   * Expose the button trigger to the parent component using a `RefCallback`,
   * this is useful for programmatic focusing, e.g. allows `react-hook-form`
   * to focus the date picker when there is an input error.
   */
  triggerRef: RefCallback<HTMLButtonElement>;
}

export function DatePicker({ triggerRef, ...props }: DatePickerProps) {
  const state = useDatePickerState(props);
  const ref = useRef(null);
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps, errorMessageProps } =
    useDatePicker(props, state, ref);
  const isError = props.errorMessage !== undefined;

  const clear = useCallback(() => {
    // For clearing value: https://github.com/adobe/react-spectrum/issues/4986#issuecomment-1703337523
    state.setDateValue(null!);
  }, [state]);
  const assignRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef(node);
    },
    [triggerRef],
  );

  return (
    <>
      <div
        className={cn(
          'relative flex-col rounded-2xl bg-input pb-2 pr-5 pt-8 text-left outline-none ring-foreground focus-within:ring-2',
          isError && 'bg-destructive ring-destructive-foreground focus-within:ring-4',
        )}>
        <span
          {...labelProps}
          className={cn(
            'absolute left-16 top-[9px] text-sm',
            isError ? 'text-destructive-foreground' : 'text-muted-foreground',
          )}>
          {props.label}
        </span>

        <ButtonNaked {...buttonProps} ref={assignRef} className="absolute left-5 top-[50%] translate-y-[-50%]">
          <SvgCalendar className="h-6 w-6 stroke-muted-foreground hover:stroke-foreground group-focus-within:stroke-black" />
        </ButtonNaked>
        <div {...groupProps} ref={ref} className="group ml-16 flex">
          <div className="relative flex items-center rounded-md border border-muted p-1 transition-colors group-focus-within:border-muted-foreground group-hover:border-muted-foreground group-focus-within:group-hover:border-muted-foreground">
            <DateField {...fieldProps} />
          </div>
        </div>
        {state.isOpen && (
          <Popover triggerRef={ref} state={state} placement="bottom start">
            <DatePickerDialog {...dialogProps}>
              <Calendar {...calendarProps} />
            </DatePickerDialog>
          </Popover>
        )}
        <Button
          Icon={SvgClose}
          iconClassName="stroke-muted-foreground"
          mode="ghost"
          size="small"
          onPress={clear}
          className={cn('absolute right-5 top-[50%] z-[1] hidden translate-y-[-50%]', state.value !== null && 'block')}
          aria-label="Clear"
        />
      </div>
      {isError && (
        <p className="mt-2 font-medium text-foreground" {...errorMessageProps}>
          {props.errorMessage as string}
        </p>
      )}
    </>
  );
}
