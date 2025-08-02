// src/components/TodoItem.tsx
"use client";

import { useState, useEffect } from "react"; // useState und useEffect importieren
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Typ-Definition für ein Todo, passend zu deiner Datenbank-Tabelle
type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
};

export default function TodoItem({ todo }: { todo: Todo }) {
  const supabase = createClientComponentClient();

  // Lokaler State für die Checkbox, um sofortiges Feedback zu geben
  const [isChecked, setIsChecked] = useState(todo.is_completed);

  // Synchronisiert den lokalen State, falls sich die übergebenen Props ändern
  useEffect(() => {
    setIsChecked(todo.is_completed);
  }, [todo.is_completed]);

  const handleToggleComplete = async () => {
    // 1. UI sofort aktualisieren (Optimistic Update)
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    // 2. Datenbank im Hintergrund aktualisieren
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: newCheckedState })
      .eq("id", todo.id);

    // 3. Bei einem Fehler die UI-Änderung zurücksetzen
    if (error) {
      console.error("Fehler beim Aktualisieren des Todos:", error);
      setIsChecked(!newCheckedState); // Setzt den Haken auf den ursprünglichen Zustand zurück
    }
  };

  return (
    <li className="flex items-center p-2 bg-gray-800 rounded-md">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
        checked={isChecked} // Bindung an den lokalen State
        onChange={handleToggleComplete}
      />
      <span className={isChecked ? "line-through text-gray-500" : ""}>
        {" "}
        {/* Bindung an den lokalen State */}
        {todo.title}
      </span>
    </li>
  );
}
