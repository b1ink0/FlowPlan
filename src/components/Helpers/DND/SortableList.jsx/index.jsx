// @ts-check
import React, { act, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
import { useStateContext } from "../../../../context/StateContext";

export function SortableList({ items, onChange, renderItem, className }) {
  const { dragDurationAll, setDragDurationAll } = useStateContext();
  const [active, setActive] = useState(null);
  const activeItem = useMemo(
    () => items.find((item) => item?.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
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
          // when dragging duration field with containing fields
          if (!dragDurationAll) {
            if (items[activeIndex].type === "duration") {
              if (activeIndex < overIndex) {
                for (let i = activeIndex; i < overIndex + 1; i++) {
                  if (items[i].type === "durationEnd") {
                    setActive(null);
                    return;
                  }
                }
              } else {
                for (let i = overIndex; i < activeIndex + 1; i++) {
                  if (items[i].type === "durationEnd") {
                    setActive(null);
                    return;
                  }
                }
              }
            } else if (items[activeIndex].type === "durationEnd") {
              if (activeIndex < overIndex) {
                for (let i = activeIndex; i < overIndex + 1; i++) {
                  if (items[i].type === "duration") {
                    setActive(null);
                    return;
                  }
                }
              } else {
                for (let i = overIndex; i < activeIndex + 1; i++) {
                  if (items[i].type === "duration") {
                    setActive(null);
                    return;
                  }
                }
              }
            }
          } else {
            if (items[activeIndex].type === "duration") {
              if (activeIndex < overIndex) {
                let flag = true;
                let insideDuration = true;
                let durationEndIndex = null;
                for (let i = activeIndex + 1; i < overIndex + 1; i++) {
                  if (items[i].type === "durationEnd") {
                    if (items[i].data?.durationId === items[activeIndex].id) {
                      flag = false;
                      durationEndIndex = i;
                    } else {
                      flag = true;
                    }
                    insideDuration = false;
                  } else if (items[i].type === "duration") {
                    flag = false;
                    insideDuration = true;
                  } else {
                    if (insideDuration) {
                      flag = false;
                    } else {
                      flag = true;
                    }
                  }
                }
                if (!flag) {
                  setActive(null);
                  setDragDurationAll(false);
                  return;
                }
                let deleteCount = durationEndIndex - activeIndex + 1;
                let elementsToMove = items.splice(activeIndex, deleteCount);
                let newOverIndex = overIndex + 1;
                if (activeIndex < overIndex) {
                  newOverIndex -= deleteCount;
                }
                onChange(items.splice(newOverIndex, 0, ...elementsToMove));
                setDragDurationAll(false);
                setActive(null);
                return;
              } else {
                let flag = true;
                let insideDuration = false;
                for (let i = activeIndex - 1; i > overIndex - 1; i--) {
                  if (items[i].type === "durationEnd") {
                    flag = false;
                    insideDuration = true;
                  } else if (items[i].type === "duration") {
                    flag = true;
                    insideDuration = false;
                  } else {
                    if (insideDuration) {
                      flag = false;
                    } else {
                      flag = true;
                    }
                  }
                }
                if (!flag) {
                  setActive(null);
                  setDragDurationAll(false);
                  return;
                }
                let durationEndIndex = null;
                for (let i = activeIndex; i < items.length; i++) {
                  if (items[i].type === "durationEnd") {
                    if (items[i].data?.durationId === items[activeIndex].id) {
                      durationEndIndex = i;
                      break;
                    }
                  }
                }
                let deleteCount = durationEndIndex - activeIndex + 1;
                let elementsToMove = items.splice(activeIndex, deleteCount);

                onChange(items.splice(overIndex, 0, ...elementsToMove));
                setDragDurationAll(false);
                setActive(null);
                return;
              }
            }
          }
          setDragDurationAll(false);
          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
        setDragDurationAll(false);
      }}
    >
      <SortableContext items={items}>
        <div
          className={"SortableList list-none w-full transition-all" + className}
          role="application"
        >
          {items.map((item, index) => (
            <React.Fragment
              key={"field-fragment-id-" + item?.type + "-" + item?.id}
            >
              {renderItem(item, active, setActive, index)}
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
