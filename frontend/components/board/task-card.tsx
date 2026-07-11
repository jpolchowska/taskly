"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getCategoryColor } from "@/lib/categories";
import { DragHandleIcon, MenuDotsIcon } from "./icons";

interface TaskCardProps {
  id: string;
  title: string;
  category: string;
}

export function TaskCard({ id, title, category }: TaskCardProps) {
  const color = getCategoryColor(category);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-start gap-2.5 rounded-2xl border border-border bg-card py-3.5 pr-3 pl-2 shadow-(--shadow-card) transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover) active:cursor-grabbing"
    >
      <div className="shrink-0 pt-1 text-muted-foreground opacity-60">
        <DragHandleIcon />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="text-sm leading-snug font-medium text-foreground">{title}</div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.75 w-1.75 shrink-0 rounded-full"
            style={{ backgroundColor: `light-dark(${color.light}, ${color.dark})` }}
          />
          <span className="text-[11.5px] font-medium text-muted-foreground">{category}</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Task menu"
        className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
      >
        <MenuDotsIcon />
      </button>
    </div>
  );
}
