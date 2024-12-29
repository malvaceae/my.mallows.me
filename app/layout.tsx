'use client';

// Amplify - Utilities
import { I18n } from 'aws-amplify/utils';

// Amplify - UI React
import {
  Authenticator,
  AuthenticatorProps,
  Heading,
  translations,
  useTheme,
} from '@aws-amplify/ui-react';

// Amplify - UI React - Styles
import '@aws-amplify/ui-react/styles.css';

// 日本語対応
I18n.putVocabularies(translations);
I18n.setLanguage('ja');

// 認証コンポーネントのカスタマイズ
const components: AuthenticatorProps['components'] = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          level={3}
          paddingTop={tokens.space.xl}
          textAlign='center'
        >
          my.mallows.me
        </Heading>
      );
    },
    Footer() {
      return null;
    },
  },
};

// ルートレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Authenticator components={components} hideSignUp>
          {children}
        </Authenticator>
      </body>
    </html>
  );
}
