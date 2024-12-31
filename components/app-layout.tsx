'use client';

// shadcn/ui - Breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
        <header className='flex gap-2 justify-between h-16 border-b'>
          <div className='flex gap-2 items-center px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator className='h-4 mr-2' orientation='vertical' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/'>
                    ホーム
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    ライブストリーミング
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='flex gap-2 items-center px-4'>
            <ThemeToggle className='w-7 h-7 -mr-1' />
          </div>
        </header>
        <div className='p-4'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}