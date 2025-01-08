// Next.js
import type { Metadata } from 'next';

// Next.js - Google Fonts
import { Noto_Sans_JP } from 'next/font/google';

// Styles
import '@/app/globals.css';

// テーマプロバイダー
import { ThemeProvider } from '@/components/theme-provider';

// 認証機能
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

// Noto Sans JP
const notoSansJp = Noto_Sans_JP({
  subsets: [
    'latin',
  ],
});

// ルートレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={notoSansJp.className}>
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
