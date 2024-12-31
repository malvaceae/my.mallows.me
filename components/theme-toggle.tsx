'use client';

// Next.js - Themes
import { useTheme } from 'next-themes';

// Lucide React
import {
  Moon,
  Sun,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// テーマ切替ボタン
export function ThemeToggle({ ...props }: React.ComponentProps<typeof Button>) {
  // テーマ
  const { theme, setTheme } = useTheme();

  // テーマ切替
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button size='icon' variant='ghost' onClick={toggleTheme} {...props}>
      <Sun className='dark:hidden w-[1.3rem] h-[1.5rem]' />
      <Moon className='hidden dark:block w-5 h-5' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
