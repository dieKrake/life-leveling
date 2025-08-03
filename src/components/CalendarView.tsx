// src/components/CalendarView.tsx
"use client";

import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

// Typ-Definition für ein Todo
type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
  // Füge hier weitere Felder hinzu, falls du sie brauchst
};

export default function CalendarView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // Die API-Route ruft die Daten jetzt aus deiner DB ab
        const response = await fetch("/api/get-events");
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Todos vom Server");
        }
        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ein unbekannter Fehler ist aufgetreten"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return <p>Lade Todos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Deine Aufgaben</h2>
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
