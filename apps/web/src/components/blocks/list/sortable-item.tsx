import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortableObject } from "@/types/objects";

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  data: SortableObject;
}

export function SortableItem({ id, children, data }: SortableItemProps) {
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
    disabled: false,
  });

  const isEditorFocused = (event: KeyboardEvent | MouseEvent) => {
    const target = event.target as HTMLElement;
    return (
      target.closest(".ProseMirror") !== null ||
      target.closest(".novel-commands") !== null
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
      className={cn("touch-none cursor-move", isDragging && "opacity-50")}
    >
      {children}
    </div>
  );
}
