import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import CalendarView from "@/components/CalendarView";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Mein Kalender</h1>
      {user ? (
        <div>
          <p className="mb-4">Angemeldet als: {user.email}</p>
          <CalendarView />
        </div>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}
