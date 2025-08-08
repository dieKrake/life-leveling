// src/components/TodoItem.tsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Todo } from "@/types";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TodoItem({ todo }: { todo: Todo }) {
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
      setIsChecked(!checked);
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
