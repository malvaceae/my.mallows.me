// TanStack Router
import { createRouter } from '@tanstack/react-router';

// ルートツリー
import { routeTree } from '@/routeTree.gen';

// ルーター
export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  });
}
