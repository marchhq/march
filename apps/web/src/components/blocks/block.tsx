"use client";

import { BlockProvider } from "@/contexts/block-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBlock } from "@/contexts/block-context";

interface BlockProps {
  id: string;
  children: React.ReactNode;
}

export function Block({ id, children }: BlockProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <BlockProvider blockId={id}>
      <BlockContent sensors={sensors}>{children}</BlockContent>
    </BlockProvider>
  );
}

// Separate component to use the context
function BlockContent({
  children,
  sensors,
}: {
  children: React.ReactNode;
  sensors: ReturnType<typeof useSensors>;
}) {
  const { handleDragEnd } = useBlock();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="block-container">{children}</div>
    </DndContext>
  );
}
