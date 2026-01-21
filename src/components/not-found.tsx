// shadcn/ui - Separator
import { Separator } from '@/components/ui/separator';

// 404 Not Found
export function NotFound() {
  return (
    <div className='flex flex-1 justify-center'>
      <div className='flex items-center gap-4'>
        <div className='text-2xl font-bold'>
          404
        </div>
        <div className='h-12'>
          <Separator
            className='bg-black/30 dark:bg-white/30'
            orientation='vertical'
          />
        </div>
        <div className='text-sm'>
          このページは存在しません。
        </div>
      </div>
    </div>
  );
}
