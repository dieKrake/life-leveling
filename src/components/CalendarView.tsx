// src/components/CalendarView.tsx
"use client";

import useSWR from "swr";
import TodoItem from "./TodoItem";
import type { Todo } from "@/types";
import { useMemo } from "react"; // useMemo importieren

export default function CalendarView() {
  // Wir holen uns die 'mutate'-Funktion von SWR.
  // 'mutate' weist SWR an, die Daten neu vom Server zu laden.
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR<Todo[]>("/api/get-events");

  // Wir filtern die Todos mit useMemo, um die Listen nur dann neu zu berechnen,
  // wenn sich die 'todos'-Daten tatsächlich ändern.
  const incompleteTodos = useMemo(
    () => todos?.filter((todo) => !todo.is_completed) || [],
    [todos]
  );
  const completedTodos = useMemo(
    () => todos?.filter((todo) => todo.is_completed) || [],
    [todos]
  );

  if (isLoading) {
    return <p>Lade Todos...</p>;
  }

  if (error) {
    return <p className="text-red-500">Fehler: {error.message}</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-16 w-5/6">
      {/* Offene Aufgaben */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Offene Aufgaben</h2>
        {incompleteTodos.length > 0 ? (
          <ul className="space-y-3">
            {incompleteTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={mutate} />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Super! Keine offenen Aufgaben.
          </p>
        )}
      </div>

      {/* Erledigte Aufgaben */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Erledigte Aufgaben</h2>
        {completedTodos.length > 0 ? (
          <ul className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={mutate} />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Noch keine Aufgaben erledigt.</p>
        )}
      </div>
    </div>
  );
}
