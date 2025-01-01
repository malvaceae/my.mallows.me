// Next.js
import type { Metadata } from 'next';

// Styles
import '@/app/globals.css';

// Themes
import { ThemeProvider } from '@/components/theme-provider';

// 認証
import { Authenticator } from '@/components/authenticator';

// アプリレイアウト
import { AppLayout } from '@/components/app-layout';

// メタデータ
export const metadata: Metadata = {
  title: {
    template: '%s | my.mallows.me',
    default: 'my.mallows.me',
  },
};

// ルートレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          <Authenticator>
            <AppLayout>
              {children}
            </AppLayout>
          </Authenticator>
        </ThemeProvider>
      </body>
    </html>
  );
}
