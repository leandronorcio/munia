import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CreatePostSortItem } from './CreatePostSortItem';
import { VisualMedia } from 'types';

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export function CreatePostSort({
  visualMedia,
  setVisualMedia,
}: {
  visualMedia: VisualMedia[];
  setVisualMedia: React.Dispatch<React.SetStateAction<VisualMedia[]>>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // The `url` of <VisualMedia> will serve as the ID's of the <SortableContext>.
  const itemIds = useMemo(
    () => visualMedia.map((item) => item.url),
    [visualMedia],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
      measuring={measuringConfig}
    >
      <div className="grid grid-cols-2 gap-2 px-2">
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          {visualMedia.map((item) => (
            <CreatePostSortItem
              key={item.url}
              url={item.url}
              type={item.type}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setVisualMedia((items) => {
        // Find the index by matching the id of the Sortable against the `url` of VisualMedia.
        const oldIndex = items.findIndex((item) => item.url === active.id);
        const newIndex = items.findIndex((item) => item.url === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleRemove(id: string) {
    setVisualMedia((items) => {
      return items.filter((item) => item.url !== id);
    });
  }
}
