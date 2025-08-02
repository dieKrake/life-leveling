// app/api/get-events/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

  const { provider_token } = session;

  const googleApiUrl = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events"
  );
  googleApiUrl.searchParams.append("timeMin", new Date().toISOString());
  googleApiUrl.searchParams.append("singleEvents", "true");
  googleApiUrl.searchParams.append("orderBy", "startTime");
  googleApiUrl.searchParams.append("maxResults", "15");

  const response = await fetch(googleApiUrl, {
    headers: {
      Authorization: `Bearer ${provider_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: error.error.message },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data.items);
}
