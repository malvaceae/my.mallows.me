// Next.js
import type { Metadata } from 'next';

// メタデータ
export const metadata: Metadata = {
  title: 'ライブストリーミング',
};

// ライブストリーミングレイアウト
export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
