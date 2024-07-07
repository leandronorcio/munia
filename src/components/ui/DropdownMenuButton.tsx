import { Key, SVGProps, useRef } from 'react';
import { AriaMenuProps, useMenuTrigger } from 'react-aria';
import { MenuTriggerProps, useMenuTriggerState } from 'react-stately';
import { MoreVert } from '@/svg_components';
import { cn } from '@/lib/cn';
import Button from './Button';
import { Popover } from './Popover';
import { DropdownMenu } from './DropdownMenu';

interface MenuButtonProps<T extends object>
  extends AriaMenuProps<T>,
    MenuTriggerProps {
  onAction: (key: Key) => void;
  label: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export function DropdownMenuButton<T extends object>(
  props: MenuButtonProps<T>,
) {
  // Create state based on the incoming props
  const state = useMenuTriggerState(props);

  // Get props for the menu trigger and menu elements
  const ref = useRef(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, ref);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        {...menuTriggerProps}
        ref={ref}
        aria-label={props.label}
        className="fill-red-500"
        Icon={(buttonIconProps) =>
          props.Icon ? (
            <props.Icon
              className={cn(buttonIconProps.className, 'fill-muted-foreground')}
            />
          ) : (
            <MoreVert
              className={cn(buttonIconProps.className, 'fill-muted-foreground')}
            />
          )
        }
        mode="ghost"
      />
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom right">
          <DropdownMenu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy || true}
            onClose={() => state.close()}
            onAction={props.onAction}
          />
        </Popover>
      )}
    </div>
  );
}
