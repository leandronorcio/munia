import { TreeState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { AriaMenuSectionProps, useMenuSection, useSeparator } from 'react-aria';
import { Key } from 'react';
import { DropdownMenuItem } from './DropdownMenuItem';

interface MenuSectionProps<T> extends AriaMenuSectionProps {
  section: Node<T>;
  state: TreeState<T>;
  onAction: (key: Key) => void;
  onClose: () => void;
}

export function DropdownMenuSection<T>({ section, state, onAction, onClose }: MenuSectionProps<T>) {
  const { itemProps, groupProps } = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  const { separatorProps } = useSeparator({
    elementType: 'li',
  });

  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className="mx-2 mb-1 mt-1 border-t border-gray-300" />
      )}
      <li {...itemProps}>
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <DropdownMenuItem key={node.key} item={node} state={state} onAction={onAction} onClose={onClose} />
          ))}
        </ul>
      </li>
    </>
  );
}
