import React from 'react';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete } from '@/svg_components';

function animateLayoutChanges(args: any) {
  const { isSorting, wasDragging } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

export function CreatePostSortItem({
  type,
  url,
  onRemove,
}: VisualMedia & { onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url, animateLayoutChanges });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        onClick={() => onRemove(url)}
        className="p-2 bg-red-500 hover:bg-red-600 absolute top-2 right-2 rounded-lg z-20"
      >
        <Delete className="stroke-red-50" />
      </button>
      <div {...attributes} {...listeners} className="h-[240px] cursor-move">
        {type === 'PHOTO' ? (
          <img src={url} className="w-full h-full object-cover rounded-md" />
        ) : (
          <video className="w-full h-full object-cover rounded-md z-10">
            <source src={url} />
          </video>
        )}
      </div>
    </div>
  );
}
