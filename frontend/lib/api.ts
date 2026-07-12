const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export type Status = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  category: string;
  status: Status;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/api/tasks");
}

export function createTask(data: { title: string; category: string; status: Status }): Promise<Task> {
  return request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(data) });
}

export function updateTask(
  id: string,
  data: Partial<Pick<Task, "title" | "category" | "status" | "order">>,
): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: "DELETE" });
}

export function getRandomQuote(): Promise<Quote> {
  return request<Quote>("/api/quotes/random");
}
