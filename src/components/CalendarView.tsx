// src/components/CalendarView.tsx
"use client";

import useSWR from "swr";
import TodoItem from "./TodoItem";
import type { Todo } from "@/types";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CalendarView() {
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. SWR nutzt die schnelle Lese-Route /api/get-todos
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR<Todo[]>("/api/get-todos");

  // 2. Deine Logik zum Filtern der Listen bleibt exakt gleich
  const incompleteTodos = useMemo(
    () => todos?.filter((todo) => !todo.is_completed) || [],
    [todos]
  );
  const completedTodos = useMemo(
    () => todos?.filter((todo) => todo.is_completed) || [],
    [todos]
  );

  // 3. Deine handleSync Funktion für den Button bleibt auch gleich
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch("/api/sync-events", { method: "POST" });
      // Nach dem Sync die Todo-Liste neu laden
      mutate();
    } catch (err) {
      console.error("Fehler bei der Synchronisierung:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return <p>Lade Todos...</p>;
  }

  if (error) {
    return <p className="text-red-500">Fehler: {error.message}</p>;
  }

  // 4. Der return-Teil wird aus deiner alten Komponente übernommen und
  //    um den Sync-Button ergänzt.
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-end">
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing
            ? "Synchronisiere..."
            : "Mit Google Kalender synchronisieren"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-16 w-full">
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
            <p className="text-muted-foreground">
              Noch keine Aufgaben erledigt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
