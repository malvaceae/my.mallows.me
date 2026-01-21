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
  const { setTheme } = useTheme();

  // テーマ切替
  const toggleTheme = useCallback(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={toggleTheme}
      {...props}
    >
      <Sun className='dark:hidden w-[1.3rem] h-6' />
      <Moon className='hidden dark:block w-5 h-5' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
