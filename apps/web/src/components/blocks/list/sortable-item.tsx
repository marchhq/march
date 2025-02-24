import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  data: {
    type: string;
    text: string;
    checked: boolean;
  };
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
    id,
    data,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("touch-none cursor-move", isDragging && "opacity-50")}
    >
      {children}
    </div>
  );
}
