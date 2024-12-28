// Next.js
import type { Metadata } from 'next';

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
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
