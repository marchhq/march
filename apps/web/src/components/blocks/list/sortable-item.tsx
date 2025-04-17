import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortableObject } from "@/types/objects";
import { useEffect } from "react";

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  data: SortableObject;
  item: {
    _id: string;
    text: string;
    checked: boolean;
  };
  containerId: string;
  index: number;
  onDragStateChange?: (isDragging: boolean) => void;
}

export function SortableItem({
  id,
  children,
  data,
  item,
  containerId,
  index,
  onDragStateChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: data,
    disabled: document.querySelector('[role="dialog"]') !== null,
  });

  useEffect(() => {
    onDragStateChange?.(isDragging);
  }, [isDragging, onDragStateChange]);

  const isEditorFocused = (event: KeyboardEvent | React.MouseEvent) => {
    const target = event.target as HTMLElement;
    return (
      target.closest(".ProseMirror") !== null ||
      target.closest(".novel-commands") !== null ||
      target.closest('[role="dialog"]') !== null
    );
  };

  const modifiedListeners = {
    ...listeners,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (isEditorFocused(e.nativeEvent)) {
        return;
      }
      if (listeners) {
        listeners.onKeyDown?.(e);
      }
    },
    onMouseDown: (e: React.MouseEvent) => {
      if (isEditorFocused(e)) {
        return;
      }
      if (listeners) {
        listeners.onMouseDown?.(e);
      }
    },
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...modifiedListeners}
      className={cn(
        "touch-none cursor-move draggable-item",
        isDragging && "opacity-50"
      )}
      data-object={JSON.stringify({
        type: "list-item",
        text: item.text,
        checked: item.checked,
        sortable: {
          containerId,
          index,
          items: [item._id],
        },
      })}
    >
      {children}
    </div>
  );
}
