// TanStack Router
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

// TanStack Router Devtools
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// TanStack Start
import { createServerFn } from '@tanstack/react-start';

// TanStack Start - Server
import { getCookie } from '@tanstack/react-start/server';

// Amplify
import { Amplify } from 'aws-amplify';

// Noto Sans JP
import '@fontsource/noto-sans-jp';

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

// Amplifyの設定
import outputs from '~/amplify_outputs.json';

// Amplifyの設定を適用
Amplify.configure(outputs);

// サイドバーの開閉状態を取得する
const getSidebarState = createServerFn().handler(() => {
  return getCookie('sidebar_state') ?? 'true';
});

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
          href: '/favicon.ico',
          type: 'image/x-icon',
        },
      ],
    };
  },
  loader: async () => ({
    sidebarState: await getSidebarState(),
  }),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

// ルートドキュメント
function RootDocument({
  children,
}: {
  children: React.ReactNode;
}) {
  // サイドバーの開閉状態
  const { sidebarState } = Route.useLoaderData();

  return (
    <html lang='ja'>
      <head>
        <HeadContent />
      </head>
      <body className='font-[Noto_Sans_JP,ui-sans-serif,system-ui,sans-serif]'>
        <ThemeProvider>
          <Authenticator>
            <AppLayout sidebarOpen={sidebarState === 'true'}>
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
