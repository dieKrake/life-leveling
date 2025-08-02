// src/components/CalendarView.tsx
"use client";

import { useEffect, useState } from "react";

// Typ-Definition für ein Kalender-Event (kannst du nach Bedarf erweitern)
interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/get-events");
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Termine");
        }
        const data: CalendarEvent[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("fetched events:", events);
  }, [events]);

  return (
    <div className="w-full max-w-4xl mb-8">
      <h2 className="text-2xl font-semibold mb-4">Anstehende Termine</h2>
      {loading ? (
        <p>Lade Termine...</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-2 bg-gray-700 rounded">
              <strong>{event.summary}</strong> -{" "}
              {new Date(event.start.dateTime).toLocaleString("de-DE")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
