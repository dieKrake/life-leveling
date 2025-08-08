// app/login/page.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Wenn der Nutzer bereits eingeloggt ist, leite ihn SOFORT weiter.
      // Dieser Check findet jetzt innerhalb des useEffects statt.
      if (user) {
        router.push("/");
      } else {
        // Nur wenn kein Nutzer da ist, beenden wir den Ladezustand
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router]); // router als Abhängigkeit hinzufügen

  // Zeige einen Ladezustand an, bis die Prüfung abgeschlossen ist
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Lade...</p>
      </div>
    );
  }

  // Dieser Teil wird nur angezeigt, wenn der Nutzer definitiv ausgeloggt ist
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar profile email",
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Anmelden</h1>
      <p className="mb-8 text-center">
        Bitte melde dich an, um auf deine Todos zuzugreifen.
      </p>
      <button
        onClick={handleSignIn}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Mit Google anmelden
      </button>
    </div>
  );
}
