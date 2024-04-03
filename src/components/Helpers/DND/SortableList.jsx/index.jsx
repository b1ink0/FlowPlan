// @ts-check
import React, { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

// import "./SortableList.css";

import { DragHandle, SortableItem } from "../Sortable";
import { SortableOverlay } from "../Overlay";

export function SortableList({ items, onChange, renderItem, className }) {
  const [active, setActive] = useState(null);
  const activeItem = useMemo(
    () => items.find((item) => item?.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active?.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <div
          className={"SortableList list-none w-full " + className}
          role="application"
        >
          {items.map((item, index) => (
            <React.Fragment key={item?.id}>
              {renderItem(item, active, index)}
            </React.Fragment>
          ))}
        </div>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem, active, null) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
