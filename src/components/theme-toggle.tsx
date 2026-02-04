// Lucide React
import {
  Check,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// shadcn/ui - Dropdown Menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// テーマ
import { useTheme } from '@/components/theme-provider';

// テーマ切替ボタン
export function ThemeToggle(props: React.ComponentProps<typeof Button>) {
  // テーマ
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          {...props}
        >
          {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun />
          ライト
          {theme === 'light' && <Check className='ml-auto' />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon />
          ダーク
          {theme === 'dark' && <Check className='ml-auto' />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor />
          システム
          {theme === 'system' && <Check className='ml-auto' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
