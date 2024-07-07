import React, { useCallback, useMemo } from 'react';
import { useSortable, defaultAnimateLayoutChanges, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, FullScreenExpandResize } from '@/svg_components';
import { GetVisualMedia } from '@/types/definitions';

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export function CreatePostSortItem({ type, url, onRemove }: GetVisualMedia & { onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url, animateLayoutChanges });

  const onRemoveClick = useCallback(() => onRemove(url), [onRemove, url]);
  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition],
  );

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        type="button"
        onClick={onRemoveClick}
        className="absolute right-2 top-2 z-20 rounded-lg bg-destructive p-2 hover:bg-destructive/70">
        <Delete className="stroke-destructive-foreground" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute left-[50%] top-[50%] z-10 inline-block translate-x-[-50%] translate-y-[-50%] cursor-move touch-none rounded-full bg-black/30 p-6">
        <FullScreenExpandResize stroke="white" strokeWidth={2} width={48} height={48} />
      </div>
      <div className="h-[240px]">
        {type === 'PHOTO' ? (
          <img src={url} alt="" className="h-full w-full rounded-md object-cover" />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="z-10 h-full w-full rounded-md object-cover">
            <source src={url} />
          </video>
        )}
      </div>
    </div>
  );
}
