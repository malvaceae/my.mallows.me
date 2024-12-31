// Next.js
import type { Metadata } from 'next';

// shadcn/ui - Separator
import { Separator } from '@/components/ui/separator';

// メタデータ
export const metadata: Metadata = {
  title: '404 Not Found',
};

// 404 Not Found
export default function NotFound() {
  return (
    <div className='flex flex-1 justify-center'>
      <div className='flex items-center gap-5'>
        <div className='text-2xl font-bold'>
          404
        </div>
        <Separator
          className='h-12 bg-white/30'
          orientation='vertical'
        />
        <div className='text-sm'>
          This page could not be found.
        </div>
      </div>
    </div>
  );
}
