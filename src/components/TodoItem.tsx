// src/components/TodoItem.tsx
"use client";

import { useState, useEffect } from "react"; // useState und useEffect importieren
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Todo } from "@/types";

export default function TodoItem({ todo }: { todo: Todo }) {
  const supabase = createClientComponentClient();
  const [isChecked, setIsChecked] = useState(todo.is_completed);

  useEffect(() => {
    setIsChecked(todo.is_completed);
  }, [todo.is_completed]);

  const handleToggleComplete = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    // Update todos in local storage
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    const updatedTodos = todos.map((t: Todo) => {
      if (t.id === todo.id) {
        return { ...t, is_completed: newCheckedState };
      }
      return t;
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    const { error } = await supabase
      .from("todos")
      .update({ is_completed: newCheckedState })
      .eq("id", todo.id);

    if (error) {
      console.error("Fehler beim Aktualisieren des Todos:", error);
      setIsChecked(!newCheckedState);
    }
  };

  return (
    <li className="flex items-center p-2 bg-gray-800 rounded-md">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
        checked={isChecked}
        onChange={handleToggleComplete}
      />
      <span className={isChecked ? "line-through text-gray-500" : ""}>
        {todo.title}
      </span>
    </li>
  );
}
