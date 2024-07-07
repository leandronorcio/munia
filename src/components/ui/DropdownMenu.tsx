import { Key, useRef } from 'react';
import { AriaMenuProps, useMenu } from 'react-aria';
import { useTreeState } from 'react-stately';
import { DropdownMenuSection } from './DropdownMenuSection';

interface MenuProps<T extends object> extends AriaMenuProps<T> {
  onAction: (key: Key) => void;
  onClose: () => void;
}

export function DropdownMenu<T extends object>(props: MenuProps<T>) {
  // Create state based on the incoming props
  const state = useTreeState(props);

  // Get props for the menu element
  const ref = useRef(null);
  const { menuProps } = useMenu(props, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      className="shadow-xs min-w-[200px] origin-top-right scale-95 rounded-xl border border-border bg-popover py-2 transition-transform focus-within:scale-100 focus:scale-100 focus:outline-none">
      {[...state.collection].map((item) => (
        <DropdownMenuSection
          key={item.key}
          section={item}
          state={state}
          onAction={props.onAction}
          onClose={props.onClose}
        />
      ))}
    </ul>
  );
}
