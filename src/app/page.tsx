import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import CalendarView from "@/components/CalendarView";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Mein Kalender</h1>
      {!session && (
        <h2 className="text-2xl font-semibold mb-4">
          Die derzeitige Version unterstützt ausschließlich Google als
          Login-Variante.
        </h2>
      )}
      {session ? (
        <div>
          <p className="mb-4">Angemeldet als: {session.user.email}</p>
          <CalendarView />
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}
