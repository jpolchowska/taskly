"use client";

import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask, type Status, type Task } from "@/lib/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Couldn't reach the server. Is the backend running?"))
      .finally(() => setIsLoading(false));
  }, []);

  const addTask = useCallback(async (data: { title: string; category: string; status: Status }) => {
    const task = await createTask(data);
    setTasks((current) => [...current, task]);
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  // Optimistic: dnd-kit already moves the card visually on drop, so state
  // updates immediately and the PATCH is fired without blocking the UI.
  const moveTask = useCallback((id: string, changes: { status: Status; order: number }) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)));
    updateTask(id, changes).catch(() => {
      console.error(`Failed to persist move for task ${id}.`);
    });
  }, []);

  return { tasks, isLoading, error, addTask, removeTask, moveTask };
}
