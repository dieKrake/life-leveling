// app/api/create-event/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  const { provider_token } = session;
  const {
    title,
    startDateTime,
    endDateTime,
  }: { title: string; startDateTime: string; endDateTime: string } =
    await request.json();

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        start: { dateTime: startDateTime, timeZone: "Europe/Berlin" },
        end: { dateTime: endDateTime, timeZone: "Europe/Berlin" },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: error.error.message },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
