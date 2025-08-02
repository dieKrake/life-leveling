// src/components/TodoItem.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

// Typ-Definition für ein Todo, passend zu deiner Datenbank-Tabelle
type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
};

export default function TodoItem({ todo }: { todo: Todo }) {
  const supabase = createClientComponentClient();
  const router = useRouter(); // Um die Seite nach einer Änderung neu zu laden

  const handleToggleComplete = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !todo.is_completed })
      .eq("id", todo.id);

    if (error) {
      console.error("Fehler beim Aktualisieren des Todos:", error);
    } else {
      // Lädt die Server Component neu, um die aktualisierten Daten anzuzeigen
      router.refresh();
    }
  };

  return (
    <li className="flex items-center p-2 bg-gray-700 rounded-md">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
        checked={todo.is_completed}
        onChange={handleToggleComplete}
      />
      <span className={todo.is_completed ? "line-through text-gray-500" : ""}>
        {todo.title}
      </span>
    </li>
  );
}
