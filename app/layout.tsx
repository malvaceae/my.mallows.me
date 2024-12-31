// Next.js
import type { Metadata } from 'next';

// Styles
import '@/app/globals.css';

// Themes
import { ThemeProvider } from '@/components/theme-provider';

// Amplify - UI React
import { AmplifyLayout } from '@/components/amplify-layout';

// アプリレイアウト
import { AppLayout } from '@/components/app-layout';

// メタデータ
export const metadata = {
  title: 'my.mallows.me',
} satisfies Metadata;

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
          <AmplifyLayout>
            <AppLayout>
              {children}
            </AppLayout>
          </AmplifyLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
