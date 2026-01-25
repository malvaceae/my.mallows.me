// React
import { useEffect } from 'react';

// TanStack Router
import {
  Link,
  useLocation,
} from '@tanstack/react-router';

// Amplify - UI React Core
import { useAuthenticator } from '@aws-amplify/ui-react-core';

// Lucide React
import {
  Code2,
  Home,
  Video,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// shadcn/ui - Sidebar
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// メニュー項目
const groups = [
  {
    title: 'アプリケーション',
    items: [
      {
        title: 'ホーム',
        icon: Home,
        url: '/',
      },
      {
        title: 'ライブストリーミング',
        icon: Video,
        url: '/live',
      },
    ],
  },
  {
    title: 'リンク',
    items: [
      {
        title: 'GitHub',
        icon: Code2,
        url: 'https://github.com/malvaceae/my.mallows.me',
      },
    ],
  },
];

// アプリサイドバー
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 認証
  const { signOut } = useAuthenticator();

  // サイドバー
  const { setOpenMobile } = useSidebar();

  // 現在のURLのパス名
  const pathname = useLocation({
    select({ pathname }) {
      return pathname;
    },
  });

  // URLが変更された場合はサイドバーを閉じる
  useEffect(() => setOpenMobile(false), [setOpenMobile, pathname]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className='h-16 justify-center border-b'>
        <div className='text-center text-xl font-bold'>
          my.mallows.me
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupContent>
              <SidebarGroupLabel>
                {group.title}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className='h-16 justify-center border-t'>
        <Button variant='secondary' onClick={signOut}>
          ログアウト
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
