// src/components/AuthButton.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function AuthButton({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return user ? (
    // Wenn der Nutzer angemeldet ist -> Logout-Button
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white p-2 rounded"
    >
      Abmelden
    </button>
  ) : (
    // Wenn der Nutzer abgemeldet ist -> Login-Button
    <button
      onClick={handleSignIn}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Anmelden
    </button>
  );
}
