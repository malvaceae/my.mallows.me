'use client';

// React
import {
  useEffect,
  useState,
} from 'react';

// Next.js - Themes
import { useTheme } from 'next-themes';

// Amplify
import { Amplify } from 'aws-amplify';

// Amplify - Utilities
import { I18n } from 'aws-amplify/utils';

// Amplify - UI React
import {
  Authenticator,
  type AuthenticatorProps,
  type ColorMode,
  defaultDarkModeOverride,
  ThemeProvider,
  translations,
} from '@aws-amplify/ui-react';

// Amplify - UI React - Styles
import '@aws-amplify/ui-react/styles.css';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyの設定を適用
Amplify.configure(outputs);

// 日本語対応
I18n.putVocabularies(translations);
I18n.setLanguage('ja');

// 認証コンポーネントのカスタマイズ
const components: AuthenticatorProps['components'] = {
  SignIn: {
    Footer() {
      return null;
    },
  },
};

// Amplifyレイアウト
export function AmplifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // テーマ
  const { theme } = useTheme();

  // カラーモード
  const [colorMode, setColorMode] = useState<ColorMode>('system');

  // カラーモードをテーマに合わせる
  useEffect(() => {
    if (theme === 'system') {
      setColorMode('system');
    }
    if (theme === 'light') {
      setColorMode('light');
    }
    if (theme === 'dark') {
      setColorMode('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider
      colorMode={colorMode}
      theme={{
        name: 'theme',
        overrides: [
          defaultDarkModeOverride,
        ],
      }}
    >
      <Authenticator
        className='min-h-screen'
        components={components}
        hideSignUp
      >
        {children}
      </Authenticator>
    </ThemeProvider>
  );
}
