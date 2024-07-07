import { useRef, useMemo } from 'react';
import { DateFieldState, DateSegment as TDateSegment, useDateFieldState } from 'react-stately';
import { AriaDateFieldProps, DateValue, useDateField, useDateSegment, useLocale } from 'react-aria';
import { createCalendar } from '@internationalized/date';

function DateSegment({ segment, state }: { segment: TDateSegment; state: DateFieldState }) {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentStyle = useMemo(
    () => ({
      ...segmentProps.style,
      minWidth: segment.maxValue != null ? `${String(segment.maxValue).length}ch` : undefined,
    }),
    [segmentProps.style, segment.maxValue],
  );
  const segmentPlaceholderStyle = useMemo(
    () =>
      ({
        visibility: segment.isPlaceholder ? undefined : 'hidden',
        height: segment.isPlaceholder ? '' : 0,
        pointerEvents: 'none',
      }) as const,
    [segment.isPlaceholder],
  );

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={segmentStyle}
      className={`group box-content rounded-sm px-0.5 text-right tabular-nums outline-none focus:bg-primary focus:text-primary-foreground ${
        !segment.isEditable ? 'text-muted-foreground/90' : 'text-foreground'
      }`}>
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden="true"
        className="block w-full text-center text-muted-foreground/90 group-focus:text-primary-foreground"
        style={segmentPlaceholderStyle}>
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
}

export function DateField(props: AriaDateFieldProps<DateValue>) {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}
