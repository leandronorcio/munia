import type { AriaListBoxOptions } from '@react-aria/listbox';
import type { ListState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { useListBox, useListBoxSection, useOption } from 'react-aria';
import { Check } from '@/svg_components';
import { cn } from '@/lib/cn';
import React, { useRef } from 'react';

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface SectionProps {
  section: Node<unknown>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

function Option({ item, state }: OptionProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref,
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        'flex cursor-pointer items-center gap-[18px] px-6 py-2 outline-none',
        isSelected && 'font-semibold',
        isFocused && 'bg-accent',
        isDisabled && 'opacity-50',
      )}>
      <div className={cn('grid h-6 w-6 place-items-center rounded-md bg-input')}>
        {isSelected && <Check className="h-[18px] w-[18px] stroke-foreground" />}
      </div>
      <p className={cn('text-lg', isFocused ? 'text-accent-foreground' : 'text-muted-foreground')}>{item.rendered}</p>
    </li>
  );
}

function ListBoxSection({ section, state }: SectionProps) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  return (
    <li {...itemProps} className="my-2">
      {section.rendered && (
        <span {...headingProps} className="text-md pl-5 font-semibold">
          {section.rendered}
        </span>
      )}
      <ul {...groupProps}>
        {[...section.childNodes].map((node) => (
          <Option key={node.key} item={node} state={state} />
        ))}
      </ul>
    </li>
  );
}

export function ListBox(props: ListBoxProps) {
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxRef = ref, state } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="w-full origin-top scale-95 overflow-auto rounded-xl border border-border bg-popover py-2 outline-none transition-transform focus-within:scale-100">
      {[...state.collection].map((item) =>
        item.type === 'section' ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        ),
      )}
    </ul>
  );
}
