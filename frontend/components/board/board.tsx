"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useTasks } from "@/hooks/use-tasks";
import type { Status, Task } from "@/lib/api";
import { Column } from "./column";
import { QuoteCard } from "./quote-card";
import { TaskCard } from "./task-card";
import { Topbar } from "./topbar";

const COLUMNS: { status: Status; title: string }[] = [
  { status: "todo", title: "To do" },
  { status: "in_progress", title: "In progress" },
  { status: "done", title: "Done" },
];

function tasksByStatus(tasks: Task[], status: Status): Task[] {
  return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
}

// Fractional indexing: the moved task's order becomes the midpoint between its
// new neighbors, so reordering only ever updates the one task being dragged.
function orderBetween(before: Task | undefined, after: Task | undefined): number {
  if (before && after) return (before.order + after.order) / 2;
  if (before) return before.order + 1;
  if (after) return after.order - 1;
  return 0;
}

export function Board() {
  const { tasks, isLoading, error, addTask, removeTask, moveTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find((task) => task.id === active.id);
    if (!draggedTask) return;

    const overTask = tasks.find((task) => task.id === over.id);
    const targetStatus = overTask ? overTask.status : (over.id as Status);

    const rest = tasks.filter((task) => task.id !== active.id);
    const columnTasks = tasksByStatus(rest, targetStatus);
    const overIndex = overTask ? columnTasks.findIndex((task) => task.id === overTask.id) : columnTasks.length;
    const before = overIndex > 0 ? columnTasks[overIndex - 1] : undefined;
    const after = overIndex >= 0 ? columnTasks[overIndex] : undefined;
    const newOrder = orderBetween(before, after);

    if (draggedTask.status === targetStatus && draggedTask.order === newOrder) return;
    moveTask(draggedTask.id, { status: targetStatus, order: newOrder });
  }

  return (
    <DndContext id="taskly-board" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background px-14 py-10">
        <div className="mx-auto max-w-295">
          <Topbar />
          <QuoteCard />

          {error ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {COLUMNS.map((column) => (
                <div key={column.status} className="flex flex-col gap-3.5">
                  <div className="text-sm font-semibold text-foreground">{column.title}</div>
                  <div className="h-24 animate-pulse rounded-2xl bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {COLUMNS.map((column) => (
                <Column
                  key={column.status}
                  id={column.status}
                  title={column.title}
                  tasks={tasksByStatus(tasks, column.status)}
                  onAddTask={addTask}
                  onDeleteTask={removeTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard id={activeTask.id} title={activeTask.title} category={activeTask.category} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
