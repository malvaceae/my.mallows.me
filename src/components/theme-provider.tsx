// React
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';

// 関数版ScriptOnce
import { FunctionOnce } from '@/components/function-once';

/**
 * 解決済みテーマ
 */
type ResolvedTheme = 'light' | 'dark';

/**
 * テーマ
 */
type Theme = ResolvedTheme | 'system';

/**
 * テーマプロバイダーの状態
 */
interface ThemeProviderState {
  /**
   * テーマ
   */
  readonly theme: Theme;

  /**
   * 解決済みテーマ
   */
  readonly resolvedTheme: ResolvedTheme;

  /**
   * テーマを設定する
   */
  setTheme(theme: Theme): void;
}

/**
 * テーマプロバイダーのコンテキスト
 */
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

/**
 * テーマプロバイダーのプロパティ
 */
export interface ThemeProviderProps {
  /**
   * 子コンポーネント
   */
  readonly children: React.ReactNode;

  /**
   * デフォルトテーマ
   */
  readonly defaultTheme?: Theme;

  /**
   * localStorageのキー
   */
  readonly storageKey?: string;
}

/**
 * テーマプロバイダー
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  // テーマ
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    // localStorageからテーマを復元する
    if (
      localStorage[storageKey] === 'system' ||
      localStorage[storageKey] === 'light' ||
      localStorage[storageKey] === 'dark'
    ) {
      return localStorage[storageKey];
    }

    return defaultTheme;
  });

  // 解決済みテーマ
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // テーマを適用し、システムテーマの変更を監視する
  useEffect(() => {
    const rootClasses = document.documentElement.classList;
    const mql = matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mql.matches ? 'dark' : 'light');
        rootClasses.toggle('light', !mql.matches);
        rootClasses.toggle('dark', mql.matches);
      } else {
        setResolvedTheme(theme);
        rootClasses.toggle('light', theme === 'light');
        rootClasses.toggle('dark', theme === 'dark');
      }
    };

    // 現在のテーマを反映する
    updateTheme();

    // システムテーマの変更を監視する
    mql.addEventListener('change', updateTheme);

    // 監視を解除する
    return () => mql.removeEventListener('change', updateTheme);
  }, [theme]);

  // コンテキスト値
  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme(theme: Theme) {
      setTheme(localStorage[storageKey] = theme);
    },
  }), [
    theme,
    resolvedTheme,
    storageKey,
  ]);

  return (
    <ThemeProviderContext value={value}>
      <FunctionOnce
        defaultTheme={defaultTheme}
        storageKey={storageKey}
      >
        {({ defaultTheme, storageKey }) => {
          const theme = localStorage[storageKey] ?? defaultTheme;
          const rootClasses = document.documentElement.classList;
          const mql = matchMedia('(prefers-color-scheme: dark)');

          if (theme === 'system') {
            rootClasses.toggle('light', !mql.matches);
            rootClasses.toggle('dark', mql.matches);
          } else {
            rootClasses.toggle('light', theme === 'light');
            rootClasses.toggle('dark', theme === 'dark');
          }
        }}
      </FunctionOnce>
      {children}
    </ThemeProviderContext>
  );
}

/**
 * テーマを取得する
 */
export const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
