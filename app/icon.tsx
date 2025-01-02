// Next.js - Open Graph
import { ImageResponse } from 'next/og';

// 画像サイズ
export const size = { width: 32, height: 32 };

// コンテンツタイプ
export const contentType = 'image/png';

// favicon
export default function Icon() {
  return new ImageResponse((
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        paddingTop: '2px',
        fontSize: 28,
      }}
    >
      🌸
    </div>
  ), size);
}
