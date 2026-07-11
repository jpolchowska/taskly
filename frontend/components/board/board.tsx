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
import { Column } from "./column";
import { QuoteCard } from "./quote-card";
import { TaskCard } from "./task-card";
import { Topbar } from "./topbar";

type Status = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  category: string;
  status: Status;
  order: number;
}

const COLUMNS: { status: Status; title: string }[] = [
  { status: "todo", title: "To do" },
  { status: "in_progress", title: "In progress" },
  { status: "done", title: "Done" },
];

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Study for algorithms quiz", category: "Study", status: "todo", order: 0 },
  { id: "2", title: "Gym – leg day", category: "Health", status: "todo", order: 1 },
  { id: "3", title: "Update portfolio site", category: "Work", status: "todo", order: 2 },
  { id: "4", title: "Grocery shopping", category: "Home", status: "todo", order: 3 },
  { id: "5", title: "Research paper draft", category: "Study", status: "in_progress", order: 0 },
  { id: "6", title: "Lecture notes", category: "Study", status: "done", order: 0 },
  { id: "7", title: "Project presentation", category: "Study", status: "done", order: 1 },
  { id: "8", title: "Walk my dog", category: "Personal", status: "done", order: 2 },
];

const SAMPLE_QUOTE = {
  text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  author: "Stephen Covey",
};

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
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
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

    setTasks((current) => {
      const rest = current.filter((task) => task.id !== active.id);
      const columnTasks = tasksByStatus(rest, targetStatus);

      const overIndex = overTask ? columnTasks.findIndex((task) => task.id === overTask.id) : columnTasks.length;
      const before = overIndex > 0 ? columnTasks[overIndex - 1] : undefined;
      const after = overIndex >= 0 ? columnTasks[overIndex] : undefined;

      const movedTask: Task = { ...draggedTask, status: targetStatus, order: orderBetween(before, after) };
      return [...rest, movedTask];
    });
  }

  return (
    <DndContext id="taskly-board" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background px-14 py-10">
        <div className="mx-auto max-w-295">
          <Topbar />
          <QuoteCard text={SAMPLE_QUOTE.text} author={SAMPLE_QUOTE.author} />
          <div className="grid grid-cols-3 gap-6">
            {COLUMNS.map((column) => (
              <Column
                key={column.status}
                id={column.status}
                title={column.title}
                tasks={tasksByStatus(tasks, column.status)}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard id={activeTask.id} title={activeTask.title} category={activeTask.category} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
