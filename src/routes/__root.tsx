// TanStack Router
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

// TanStack Router Devtools
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// Global Styles
import globalsCss from '@/styles/globals.css?url';

// テーマプロバイダー
import { ThemeProvider } from '@/components/theme-provider';

// 認証機能
import { Authenticator } from '@/components/authenticator';

// アプリレイアウト
import { AppLayout } from '@/components/app-layout';

// 404 Not Found
import { NotFound } from '@/components/not-found';

// ルート
export const Route = createRootRoute({
  head({ match }) {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: match.globalNotFound || match.status === 'notFound' ?
            '404 Not Found | my.mallows.me' :
            'my.mallows.me',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: globalsCss,
        },
        {
          rel: 'icon',
          href: '/icon',
          type: 'image/png',
          sizes: '32x32',
        },
      ],
    };
  },
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

// ルートドキュメント
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <HeadContent />
      </head>
      <body className='font-[Noto_Sans_JP,ui-sans-serif,system-ui,sans-serif]'>
        <ThemeProvider>
          <Authenticator>
            <AppLayout>
              {children}
            </AppLayout>
          </Authenticator>
        </ThemeProvider>
        <TanStackRouterDevtools position='bottom-right' />
        <Scripts />
      </body>
    </html>
  );
}
