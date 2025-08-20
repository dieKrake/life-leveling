import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface GoogleEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}
interface GoogleTask {
  id: string;
  title: string;
  due?: string;
}

export async function POST() {
  // FIX: Cookie-Warnung beheben
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Nicht authentifiziert" },
      { status: 401 }
    );
  }

  // --- 1. Termine von Google Calendar holen ---
  const calendarApiUrl = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events"
  );
  calendarApiUrl.searchParams.append("timeMin", new Date().toISOString());
  calendarApiUrl.searchParams.append("maxResults", "50");
  calendarApiUrl.searchParams.append("singleEvents", "true");
  calendarApiUrl.searchParams.append("orderBy", "startTime");

  const calendarResponse = await fetch(calendarApiUrl, {
    headers: { Authorization: `Bearer ${session.provider_token}` },
  });
  const googleEvents: GoogleEvent[] =
    (await calendarResponse.json()).items || [];

  // --- 2. Aufgaben von Google Tasks holen ---
  // FIX: Korrekte URL für die Google Tasks API
  const tasksApiUrl = new URL(
    "https://www.googleapis.com/tasks/v1/lists/@default/tasks"
  );
  const tasksResponse = await fetch(tasksApiUrl, {
    headers: { Authorization: `Bearer ${session.provider_token}` },
  });

  let googleTasks: GoogleTask[] = [];
  // FIX: Absturz verhindern, falls die Antwort kein JSON ist
  if (tasksResponse.ok) {
    const tasksData = await tasksResponse.json();
    googleTasks = tasksData.items || [];
  } else {
    console.error(
      `Fehler bei Google Tasks API: Status ${tasksResponse.status}`,
      await tasksResponse.text()
    );
  }

  // --- 3. Daten aufbereiten und zusammenführen ---
  const calendarTodos = googleEvents
    .filter((e) => e.summary)
    .map((event) => ({
      user_id: session.user.id,
      google_event_id: `evt-${event.id}`,
      title: event.summary,
      start_time: event.start?.dateTime || event.start?.date,
      end_time: event.end?.dateTime || event.end?.date,
    }));
  const taskTodos = googleTasks
    .filter((t) => t.title)
    .map((task) => ({
      user_id: session.user.id,
      google_event_id: `tsk-${task.id}`,
      title: task.title,
      start_time: task.due || new Date().toISOString(),
      end_time: task.due || new Date().toISOString(),
    }));
  const allTodosToUpsert = [...calendarTodos, ...taskTodos];

  // --- 4. In die Datenbank schreiben ---
  if (allTodosToUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from("todos")
      .upsert(allTodosToUpsert, { onConflict: "user_id, google_event_id" });
    if (upsertError) {
      console.error("Fehler beim Upsert:", upsertError);
      return NextResponse.json(
        { error: "Fehler beim Speichern der Todos" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: "Synchronisierung erfolgreich.",
  });
}
