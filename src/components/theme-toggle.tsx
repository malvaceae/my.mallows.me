// React
import { useCallback } from 'react';

// Lucide React
import {
  Moon,
  Sun,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// テーマプロバイダー
import { useTheme } from '@/components/theme-provider';

// テーマ切替ボタン
export function ThemeToggle({ ...props }: React.ComponentProps<typeof Button>) {
  // テーマ
  const { resolvedTheme, setTheme } = useTheme();

  // テーマ切替
  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={toggleTheme}
      {...props}
    >
      <Sun className='h-6 w-[1.3rem] dark:hidden' />
      <Moon className='hidden h-5 w-5 dark:block' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
