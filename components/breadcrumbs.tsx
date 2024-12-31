'use client';

// React
import { Fragment } from 'react';

// Next.js - Navigation
import { usePathname } from 'next/navigation';

// shadcn/ui - Breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// パス別のパンくずリスト項目
const routes: Record<string, { title: string, url: string }[]> = {
  '/': [
    {
      title: 'ホーム',
      url: '/',
    },
  ],
  '/live': [
    {
      title: 'ホーム',
      url: '/',
    },
    {
      title: 'ライブストリーミング',
      url: '/live',
    },
  ],
};

// パンくずリスト
export function Breadcrumbs() {
  // 現在のURLのパス名
  const pathname = usePathname();

  // パンくずリスト項目
  const items = routes[pathname];

  // パンくずリスト項目が存在しない場合は終了
  if (!items) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={i}>
            {i === items.length - 1 || (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.url}>
                  {item.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {i === items.length - 1 || (
              <BreadcrumbSeparator />
            )}
            {i === items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {item.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
