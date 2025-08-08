// src/components/SWRProvider.tsx
"use client";

import { SWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Importieren

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient(); // Supabase Client hier instanziieren

  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) {
            const error: any = new Error(
              "Ein Fehler ist beim Laden der Daten aufgetreten."
            );
            error.info = await res.json();
            error.status = res.status;
            throw error;
          }
          return res.json();
        },
        onError: async (error, key) => {
          // Prüfe, ob der Fehler den Status 401 hat
          if (error.status === 401) {
            // 1. ZUERST den Nutzer ausloggen, um die ungültige Session zu löschen
            await supabase.auth.signOut();

            // 2. DANN zur Login-Seite umleiten
            router.push("/login");
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
