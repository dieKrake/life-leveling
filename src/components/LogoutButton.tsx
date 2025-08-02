"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white p-2 rounded"
    >
      Abmelden
    </button>
  );
}
