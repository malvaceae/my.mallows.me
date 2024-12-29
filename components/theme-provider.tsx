'use client';

// Next.js - Themes
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// テーマプロバイダ
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
