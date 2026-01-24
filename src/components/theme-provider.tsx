// React
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Theme
 */
type Theme = 'system' | 'light' | 'dark';

/**
 * Theme Provider State
 */
interface ThemeProviderState {
  /**
   * Theme
   */
  readonly theme: Theme;

  /**
   * Set the theme.
   */
  setTheme(theme: Theme): void;
}

/**
 * Theme Provider Context
 */
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

/**
 * Theme Provider Properties
 */
export interface ThemeProviderProps {
  /**
   * Child Components
   */
  readonly children: React.ReactNode;

  /**
   * Default Theme
   */
  readonly defaultTheme?: Theme;

  /**
   * Local Storage Key
   */
  readonly storageKey?: string;
}

/**
 * Provide theme state to child components.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    // Initialize theme state from localStorage.
    if (
      localStorage[storageKey] === 'system' ||
      localStorage[storageKey] === 'light' ||
      localStorage[storageKey] === 'dark'
    ) {
      return localStorage[storageKey];
    }

    return defaultTheme;
  });

  // Apply the theme to the document.
  useEffect(() => {
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.classList.toggle('light', !mql.matches);
      document.documentElement.classList.toggle('dark', mql.matches);
    } else {
      document.documentElement.classList.toggle('light', theme === 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Theme Provider Value
  const value = useMemo(() => ({
    theme,
    setTheme(theme: Theme) {
      setTheme(localStorage[storageKey] = theme);
    },
  }), [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Return the theme context.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
