import { Key, useRef } from 'react';
import { useMenuItem } from 'react-aria';
import { TreeState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { cn } from '@/lib/cn';

interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction: (key: Key) => void;
  onClose: () => void;
}

export function DropdownMenuItem<T>({ item, state, onAction, onClose }: MenuItemProps<T>) {
  // Get props for the menu item element
  const ref = useRef(null);
  const { menuItemProps, isDisabled } = useMenuItem(
    {
      key: item.key,
      onAction,
      onClose,
    },
    state,
    ref,
  );

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  const isFocused = state.selectionManager.focusedKey === item.key;
  const focusBg = item.key === 'delete' ? 'bg-destructive' : 'bg-accent';
  const focus = isFocused
    ? `${focusBg} ${item.key === 'delete' ? 'text-destructive-foreground' : 'text-accent-foreground'}`
    : 'text-popover-foreground';

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={cn(
        `relative cursor-default select-none px-6 py-2 focus:outline-none`,
        focus,
        isDisabled && 'opacity-50',
      )}>
      {item.rendered}
    </li>
  );
}
