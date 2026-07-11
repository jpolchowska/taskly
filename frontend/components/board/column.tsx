"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  title: string;
  category: string;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
}

export function Column({ id, title, tasks, onAddTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-baseline gap-1.5 text-sm font-semibold text-foreground">
        {title} <span className="text-[13px] font-normal text-muted-foreground">({tasks.length})</span>
      </div>

      <div ref={setNodeRef} className="flex min-h-10 flex-col gap-2.5">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="rounded-2xl border-[1.5px] border-dashed border-border px-3.5 py-5 text-center text-[13px] text-muted-foreground">
              Nothing here yet
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} id={task.id} title={task.title} category={task.category} />)
          )}
        </SortableContext>
      </div>

      <button
        type="button"
        onClick={onAddTask}
        className="flex items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-border px-3.5 py-2.75 text-[13.5px] font-medium text-muted-foreground transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
      >
        <span className="text-[15px] font-semibold">+</span> Add task
      </button>
    </div>
  );
}
