"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginButton() {
  const supabase = createClientComponentClient();

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
    <button
      onClick={handleSignIn}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Mit Google anmelden
    </button>
  );
}
