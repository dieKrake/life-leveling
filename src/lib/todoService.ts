import { Todo } from "@/types";
import { convertTodoData } from "./todoConverter";

export async function fetchTodosFromApi(): Promise<Todo[]> {
  const response = await fetch("/api/get-events");

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Todos vom Server");
  }

  const data: Todo[] = await response.json();
  convertTodoData(data);
  return data;
}
