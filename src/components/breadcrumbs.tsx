// React
import { Fragment } from 'react';

// TanStack Router
import {
  Link,
  useLocation,
} from '@tanstack/react-router';

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
  const pathname = useLocation({
    select({ pathname }) {
      return pathname;
    },
  });

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
            {i < items.length - 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.url}>
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {item.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
