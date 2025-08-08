// Der neue, vereinfachte NavUser.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./AuthButton"; // Importiere nur noch den neuen Button

export default async function NavUser() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-row gap-4 items-center h-full">
      {/* Zeige die E-Mail nur an, wenn der Nutzer eingeloggt ist */}
      {user && <p className="">{user.email}</p>}

      {/* Der AuthButton entscheidet selbst, ob Login oder Logout angezeigt wird */}
      <AuthButton user={user} />
    </div>
  );
}
