// app/providers.jsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refresh session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <NextThemesProvider attribute="class" defaultTheme="system">
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}