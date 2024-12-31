'use client';

// shadcn/ui - Separator
import { Separator } from '@/components/ui/separator';

// shadcn/ui - Sidebar
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

// アプリサイドバー
import { AppSidebar } from '@/components/app-sidebar';

// パンくずリスト
import { Breadcrumbs } from '@/components/breadcrumbs';

// テーマ切替ボタン
import { ThemeToggle } from '@/components/theme-toggle';

// アプリレイアウト
export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex shrink-0 gap-2 justify-between h-16 border-b'>
          <div className='flex gap-2 items-center px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator className='h-4 mr-2' orientation='vertical' />
            <Breadcrumbs />
          </div>
          <div className='flex gap-2 items-center px-4'>
            <ThemeToggle className='w-7 h-7 -mr-1' />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
