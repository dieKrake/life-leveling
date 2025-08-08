// src/lib/todoService.ts
import type { Todo } from "@/types";

export async function fetchTodosFromApi(): Promise<Todo[]> {
  const response = await fetch("/api/get-events");

  if (!response.ok) {
    // Erstelle einen Fehler, der den Statuscode enthält
    const error: any = new Error("An error occurred while fetching the data.");
    // Hänge den Statuscode an das Fehlerobjekt an
    console.log("response.status", response.status);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
