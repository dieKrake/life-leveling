// src/components/TodoItem.tsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Todo } from "@/types";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Wir erweitern die Props um eine Funktion, die nach einem Update aufgerufen wird
type TodoItemProps = {
  todo: Todo;
  onUpdate: () => void; // Diese Funktion löst die Neu-Validierung in SWR aus
};

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const supabase = createClientComponentClient();
  const [isChecked, setIsChecked] = useState(todo.is_completed);

  useEffect(() => {
    setIsChecked(todo.is_completed);
  }, [todo.is_completed]);

  const handleToggleComplete = async (checked: boolean) => {
    setIsChecked(checked);

    const { error } = await supabase
      .from("todos")
      .update({ is_completed: checked })
      .eq("id", todo.id);

    if (error) {
      console.error("Fehler beim Aktualisieren des Todos:", error);
      setIsChecked(!checked); // Bei Fehler zurücksetzen
    } else {
      // Wenn das Update erfolgreich war, rufen wir die onUpdate-Funktion auf
      onUpdate();
    }
  };

  const todoId = `todo-${todo.id}`;

  return (
    <li className="flex items-center space-x-2 p-3 border rounded-md bg-card">
      <Checkbox
        id={todoId}
        checked={isChecked}
        onCheckedChange={handleToggleComplete}
      />
      <Label
        htmlFor={todoId}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          isChecked ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.title}
      </Label>
    </li>
  );
}
