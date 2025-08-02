// app/api/get-events/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Typ-Definition für die Google-Antwort
interface GoogleEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Nicht authentifiziert" },
      { status: 401 }
    );
  }

  // 1. Events von Google holen (wie bisher)
  const googleApiUrl = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events"
  );
  googleApiUrl.searchParams.append("timeMin", new Date().toISOString());
  googleApiUrl.searchParams.append("maxResults", "50"); // Holen wir ein paar mehr
  googleApiUrl.searchParams.append("singleEvents", "true");
  googleApiUrl.searchParams.append("orderBy", "startTime");

  const googleResponse = await fetch(googleApiUrl, {
    headers: {
      Authorization: `Bearer ${session.provider_token}`,
    },
  });

  if (!googleResponse.ok) {
    const error = await googleResponse.json();
    return NextResponse.json(
      { error: error.error.message },
      { status: googleResponse.status }
    );
  }

  const googleEvents: GoogleEvent[] = (await googleResponse.json()).items;

  // 2. Events für die Datenbank aufbereiten
  const todosToUpsert = googleEvents.map((event) => ({
    user_id: session.user.id,
    google_event_id: event.id,
    title: event.summary,
    start_time: event.start?.dateTime || event.start?.date,
    end_time: event.end?.dateTime || event.end?.date,
  }));

  // 3. Events in die Supabase-Tabelle schreiben (einfügen oder aktualisieren)
  if (todosToUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from("todos")
      .upsert(todosToUpsert, {
        onConflict: "user_id, google_event_id", // Dies stellt sicher, dass bestehende Einträge aktualisiert werden
      });

    if (upsertError) {
      console.error("Fehler beim Upsert:", upsertError);
      return NextResponse.json(
        { error: "Fehler beim Speichern der Todos" },
        { status: 500 }
      );
    }
  }

  // 4. Gespeicherte Todos aus der Datenbank lesen und zurückgeben
  const { data: todos, error: selectError } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", session.user.id)
    .order("start_time", { ascending: true });

  if (selectError) {
    return NextResponse.json(
      { error: "Fehler beim Lesen der Todos" },
      { status: 500 }
    );
  }

  return NextResponse.json(todos);
}
