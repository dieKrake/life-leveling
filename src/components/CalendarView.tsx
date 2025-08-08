// src/components/CalendarView.tsx
"use client";

import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { fetchTodosFromApi } from "@/lib/todoService";
import { Todo } from "@/types";
import RefreshButton from "./RefreshButton";

export default function CalendarView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodosFromApi();
        setTodos(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ein unbekannter Fehler ist aufgetreten"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (loading) {
    return <p>Lade Todos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <RefreshButton />
      <h2 className="text-2xl font-semibold mb-4">
        Deine Aufgaben aus dem Kalender
      </h2>
      {todos.length > 0 ? (
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
