// src/components/CalendarView.tsx
"use client";

import useSWR from "swr";
import TodoItem from "./TodoItem";
import type { Todo } from "@/types";

export default function CalendarView() {
  const { data: todos, error, isLoading } = useSWR<Todo[]>("/api/get-events");

  if (isLoading) {
    return <p>Lade Todos...</p>;
  }

  if (error) {
    return <p className="text-red-500">Fehler: {error.message}</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        Deine Aufgaben aus dem Kalender
      </h2>
      {todos && todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <p>Keine anstehenden Aufgaben gefunden.</p>
      )}
    </div>
  );
}
