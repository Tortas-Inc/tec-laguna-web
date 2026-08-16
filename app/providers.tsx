"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState } from "react";
import { DAY_MS } from "@/lib/queryConfig";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // gcTime debe ser >= al maxAge del persister de abajo — si no,
          // TanStack Query tira los datos de memoria antes de que
          // alcancen a persistirse en localStorage.
          queries: { gcTime: DAY_MS },
        },
      }),
  );

  // createSyncStoragePersister toca window.localStorage, que no existe en
  // el primer render server-side — se crea solo en el cliente.
  const [persister] = useState(() =>
    typeof window === "undefined"
      ? null
      : createSyncStoragePersister({ storage: window.localStorage }),
  );

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: DAY_MS }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
