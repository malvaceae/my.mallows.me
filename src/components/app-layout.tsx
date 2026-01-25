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
  sidebarOpen,
}: {
  children: React.ReactNode;
  sidebarOpen?: boolean;
}) {
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 justify-between gap-2 border-b'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <div className='mr-2 h-4'>
              <Separator orientation='vertical' />
            </div>
            <Breadcrumbs />
          </div>
          <div className='flex items-center gap-2 px-4'>
            <ThemeToggle className='-mr-1 h-7 w-7' />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
