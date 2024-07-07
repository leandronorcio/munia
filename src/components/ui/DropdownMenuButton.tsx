import { Key, SVGProps, useMemo, useRef } from 'react';
import { AriaMenuProps, useMenuTrigger } from 'react-aria';
import { MenuTriggerProps, useMenuTriggerState } from 'react-stately';
import { MoreVert } from '@/svg_components';
import Button from './Button';
import { Popover } from './Popover';
import { DropdownMenu } from './DropdownMenu';

interface MenuButtonProps<T extends object> extends AriaMenuProps<T>, MenuTriggerProps {
  onAction: (key: Key) => void;
  label: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export function DropdownMenuButton<T extends object>(props: MenuButtonProps<T>) {
  // Create state based on the incoming props
  const state = useMenuTriggerState(props);

  // Get props for the menu trigger and menu elements
  const ref = useRef(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, ref);
  const style = useMemo(
    () =>
      ({
        position: 'relative',
        display: 'inline-block',
      }) as const,
    [],
  );

  return (
    <div style={style}>
      <Button
        {...menuTriggerProps}
        ref={ref}
        aria-label={props.label}
        className="fill-red-500"
        Icon={props.Icon ?? MoreVert}
        iconClassName="fill-muted-foreground"
        mode="ghost"
      />
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom right">
          <DropdownMenu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy || true}
            onClose={state.close}
            onAction={props.onAction}
          />
        </Popover>
      )}
    </div>
  );
}
