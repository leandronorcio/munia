import { useCalendarState } from 'react-stately';
import { AriaCalendarProps, useCalendar, useLocale } from 'react-aria';
import { createCalendar } from '@internationalized/date';
import { CalendarGrid } from './CalendarGrid';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import Button from './Button';
import { DateValue } from '@react-types/calendar';

export function Calendar<T extends DateValue>(props: AriaCalendarProps<T>) {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state,
  );

  return (
    <div {...calendarProps} className="inline-block text-gray-800">
      <div className="flex items-center justify-between pb-4">
        <Button
          {...prevButtonProps}
          mode="ghost"
          size="small"
          Icon={() => (
            <ArrowChevronBack className="h-6 w-6 stroke-violet-500" />
          )}
        />
        <h2 className="ml-2 flex-1 text-center text-xl font-semibold">
          {title}
        </h2>
        <Button
          {...nextButtonProps}
          mode="ghost"
          size="small"
          Icon={() => (
            <ArrowChevronForward className="h-6 w-6 stroke-violet-500" />
          )}
        />
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}
