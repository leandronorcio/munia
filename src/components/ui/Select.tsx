import type { AriaSelectProps } from '@react-types/select';
import { useSelectState } from 'react-stately';
import { useSelect, HiddenSelect, useButton } from 'react-aria';
import { ForwardedRef, SVGProps, forwardRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { useObjectRef } from '@react-aria/utils';
import SvgClose from '@/svg_components/Close';
import SvgArrowChevronDown from '@/svg_components/ArrowChevronDown';
import Button from './Button';
import { Popover } from './Popover';
import { ListBox } from './SelectListBox';

interface SelectProps<T> extends AriaSelectProps<T> {
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Select = forwardRef(
  ({ Icon, ...props }: SelectProps<object>, forwardedRef: ForwardedRef<HTMLButtonElement>) => {
    // Create state based on the incoming props
    const state = useSelectState(props);

    // Get props for child elements from useSelect
    const ref = useObjectRef(forwardedRef);
    const { labelProps, triggerProps, valueProps, menuProps, errorMessageProps } = useSelect(props, state, ref);

    // Get props for the button based on the trigger props from useSelect
    const { buttonProps } = useButton(triggerProps, ref);
    const isThereASelectedValue = !!state.selectedItem;

    const { label, name, errorMessage } = props;
    const isError = errorMessage !== undefined;

    // For clearing value: https://github.com/adobe/react-spectrum/issues/4986#issuecomment-1703337523
    const clear = useCallback(() => state.setSelectedKey(null!), [state]);
    const open = useCallback(() => state.open(), [state]);

    return (
      <>
        <div className="relative">
          {Icon && (
            <div className="absolute left-5 top-[50%] translate-y-[-50%]">
              <Icon
                className={cn(isError ? 'stroke-destructive-foreground' : 'stroke-muted-foreground')}
                width={24}
                height={24}
              />
            </div>
          )}

          <button
            {...labelProps}
            type="button"
            className={cn(
              'absolute left-5 cursor-pointer text-muted-foreground transition-all',
              isThereASelectedValue ? 'top-[9px] translate-y-0 text-sm' : 'top-[50%] translate-y-[-50%] text-lg',
              Icon ? 'left-16' : 'left-5',
              isError ? 'text-destructive-foreground' : 'text-muted-foreground',
            )}
            onClick={open}>
            {label}
          </button>
          <HiddenSelect state={state} triggerRef={ref} label={label} name={name} />
          <button
            {...buttonProps}
            type="button"
            ref={ref}
            className={cn(
              'w-full rounded-2xl bg-input pb-2 pl-5 pr-5 pt-8 text-left outline-none ring-foreground focus:ring-2',
              Icon ? 'pl-16' : 'pl-5',
              isError && 'bg-destructive ring-destructive-foreground focus:ring-4',
            )}>
            <span
              {...valueProps}
              // Visually hide the 'Select an option' text
              className={cn(!isThereASelectedValue && 'text-transparent')}>
              {isThereASelectedValue ? state.selectedItem.rendered : 'Select an option'}
            </span>
            {!isThereASelectedValue && (
              <div className="absolute right-5 top-[50%] z-[1] translate-y-[-50%] p-3">
                <SvgArrowChevronDown
                  className={cn('h-5 w-5 stroke-muted-foreground transition-transform', state.isOpen && 'rotate-180')}
                />
              </div>
            )}
          </button>
          {state.isOpen && (
            <Popover state={state} triggerRef={ref} placement="bottom start" className="min-w-[200px]">
              <ListBox {...menuProps} state={state} />
            </Popover>
          )}
          <div className="absolute right-5 top-[50%] z-[1] translate-y-[-50%]">
            {isThereASelectedValue && (
              <Button
                Icon={SvgClose}
                iconClassName="stroke-muted-foreground"
                mode="ghost"
                size="small"
                onPress={clear}
                aria-label="Clear"
              />
            )}
          </div>
        </div>
        {isError && (
          <p className="mt-2 font-medium text-foreground" {...errorMessageProps}>
            {errorMessage as string}
          </p>
        )}
      </>
    );
  },
);

Select.displayName = 'Select';
