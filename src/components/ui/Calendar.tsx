import { useCalendarState } from 'react-stately';
import { AriaCalendarProps, useCalendar, useLocale } from 'react-aria';
import { createCalendar } from '@internationalized/date';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import { DateValue } from '@react-types/calendar';
import { CalendarGrid } from './CalendarGrid';
import Button from './Button';

export function Calendar<T extends DateValue>(props: AriaCalendarProps<T>) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);

  return (
    <div {...calendarProps} className="inline-block text-muted-foreground">
      <div className="flex items-center justify-between pb-4">
        <Button
          {...prevButtonProps}
          mode="ghost"
          size="small"
          Icon={ArrowChevronBack}
          iconClassName="h-6 w-6 stroke-primary"
        />
        <h2 className="ml-2 flex-1 text-center text-xl font-semibold">{title}</h2>
        <Button
          {...nextButtonProps}
          mode="ghost"
          size="small"
          Icon={ArrowChevronForward}
          iconClassName="h-6 w-6 stroke-primary"
        />
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}
