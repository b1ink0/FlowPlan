import React, { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// import "./SortableItem.css";

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <SortableItemContext.Provider value={context}>
      <div className="SortableItem list-none w-full" ref={setNodeRef} style={style}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export function DragHandle({ className }) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button title="Drag" className={className} {...attributes} {...listeners} ref={ref}>
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <path
          className="fill-[var(--logo-primary)]"
          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
        ></path>
      </svg>
    </button>
  );
}